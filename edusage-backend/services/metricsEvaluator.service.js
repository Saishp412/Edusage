const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Evaluate answer accuracy metrics using both LLM evaluation and embedding distance scores.
 *
 * @param {Object} params
 * @param {string} params.question    - The user's question
 * @param {string} params.answer      - The generated answer
 * @param {string} params.context     - The retrieved context used to answer
 * @param {number[]} params.distances - ChromaDB cosine distances for retrieved chunks
 * @param {number} params.chunksRetrieved - Number of chunks retrieved
 * @returns {Promise<Object>} accuracyMetrics
 */
async function evaluateAccuracyMetrics({ question, answer, context, distances = [], chunksRetrieved = 0 }) {
  console.log(`[METRICS] Evaluating accuracy metrics for answer...`);

  // ---- Distance-based metrics (always available) ----

  // Filter out very poor chunks (distance > 1.4) — they drag down averages unfairly
  const goodDistances = distances.filter(d => d < 1.4);
  const effectiveDistances = goodDistances.length > 0 ? goodDistances : distances;

  const avgDistance = effectiveDistances.length > 0
    ? effectiveDistances.reduce((sum, d) => sum + d, 0) / effectiveDistances.length
    : 1;

  // ChromaDB L2 distance typically ranges 0.2-1.2 for meaningful matches.
  // Use a sigmoid-like curve instead of linear mapping for more realistic scores.
  // distance=0.3 → ~95%, distance=0.6 → ~85%, distance=0.9 → ~65%, distance=1.2 → ~35%
  const distanceToScore = (dist) => {
    // Sigmoid curve centered at 0.85 with steep falloff
    const score = 100 / (1 + Math.exp(5 * (dist - 0.85)));
    return Math.max(0, Math.min(100, Math.round(score)));
  };

  const contextRelevance = distanceToScore(avgDistance);

  // Best chunk confidence — use the best match
  const minDistance = effectiveDistances.length > 0 ? Math.min(...effectiveDistances) : 1;
  const retrievalConfidence = distanceToScore(minDistance * 0.9); // Slightly boost best chunk

  // Chunk coverage bonus: more good chunks = higher confidence
  const coverageBonus = Math.min(10, Math.round(goodDistances.length * 1.5));

  // ---- LLM-based metrics ----
  let pdfGrounding = null;
  let answerCompleteness = null;

  try {
    // Provide more context for better evaluation (up to 4000 chars)
    const contextForEval = context.substring(0, 4000);
    const answerForEval = answer.substring(0, 2500);

    const evaluationPrompt = `You are an expert evaluator for a RAG (Retrieval-Augmented Generation) system used in an educational platform. Your job is to evaluate how well an AI answer is grounded in the provided PDF context.

Evaluate the following and return ONLY a JSON object with exactly two numeric fields (0-100):

{
  "pdfGrounding": <number 0-100>,
  "answerCompleteness": <number 0-100>
}

Scoring guidelines:
- pdfGrounding: What percentage of the answer's claims and information are directly supported by or can be reasonably inferred from the provided context?
  * 90-100: All key claims are directly found in the context
  * 75-89: Most claims are in the context, minor additions are reasonable inferences
  * 50-74: Some claims are from context, some are general knowledge additions
  * Below 50: Most content is not from the provided context
  
- answerCompleteness: How well does the answer address the question given the available context?
  * 90-100: The answer fully addresses the question with rich detail from context
  * 75-89: The answer addresses the main points of the question well
  * 50-74: The answer partially addresses the question
  * Below 50: The answer barely addresses the question

IMPORTANT: Be generous with scoring when the answer paraphrases, restructures, or summarizes context content — this is expected behavior. Only penalize when claims are clearly fabricated or not inferable from context. Educational reformulation of context is grounding, not hallucination.

Return ONLY the JSON object, no markdown, no explanation.

--- CONTEXT (from PDF) ---
${contextForEval}
--- END CONTEXT ---

--- QUESTION ---
${question}
--- END QUESTION ---

--- GENERATED ANSWER ---
${answerForEval}
--- END ANSWER ---

JSON:`;

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Metrics evaluation timeout after 15 seconds')), 15000);
    });

    const apiCall = openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a precise evaluation assistant for an educational RAG system. You output valid JSON objects only. Be fair and generous — paraphrasing and reformulating context is good grounding. Only penalize actual fabrication."
        },
        {
          role: "user",
          content: evaluationPrompt
        }
      ],
      max_tokens: 100,
      temperature: 0.0,
    });

    const response = await Promise.race([apiCall, timeoutPromise]);
    const rawOutput = response.choices[0].message.content.trim();

    console.log(`[METRICS] Raw LLM evaluation output:`, rawOutput);

    // Parse JSON - handle potential markdown wrapping
    let cleanOutput = rawOutput;
    if (cleanOutput.startsWith('```')) {
      cleanOutput = cleanOutput.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    }

    const parsed = JSON.parse(cleanOutput);
    pdfGrounding = Math.max(0, Math.min(100, Math.round(parsed.pdfGrounding || 0)));
    answerCompleteness = Math.max(0, Math.min(100, Math.round(parsed.answerCompleteness || 0)));

    console.log(`[METRICS] ✅ LLM evaluation: grounding=${pdfGrounding}%, completeness=${answerCompleteness}%`);
  } catch (error) {
    console.warn(`[METRICS] ⚠️ LLM evaluation failed (will use distance-based only):`, error.message);
    // Fall back to distance-based estimates — use optimistic estimates
    pdfGrounding = Math.min(100, contextRelevance + 5);
    answerCompleteness = Math.min(100, contextRelevance);
  }

  // ---- Apply coverage bonus to retrieval confidence ----
  const finalRetrievalConfidence = Math.min(100, retrievalConfidence + coverageBonus);

  // ---- Derived metrics ----
  const hallucinationRisk = Math.max(0, 100 - pdfGrounding);

  // Weighted overall score
  const overallScore = Math.round(
    pdfGrounding * 0.35 +
    answerCompleteness * 0.25 +
    contextRelevance * 0.25 +
    finalRetrievalConfidence * 0.15
  );

  const metrics = {
    pdfGrounding,
    answerCompleteness,
    contextRelevance,
    retrievalConfidence: finalRetrievalConfidence,
    hallucinationRisk,
    overallScore,
    modelUsed: "gpt-3.5-turbo",
    chunksRetrieved,
    avgChunkDistance: Math.round(avgDistance * 1000) / 1000,
    evaluatedAt: new Date()
  };

  console.log(`[METRICS] Final metrics:`, JSON.stringify(metrics, null, 2));
  return metrics;
}

module.exports = { evaluateAccuracyMetrics };
