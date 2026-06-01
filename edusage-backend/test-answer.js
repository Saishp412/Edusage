require('dotenv').config();
const synthesizeAnswer = require('./services/answerSynthesizer.service');

async function testAnswer() {
  console.log('🧪 Testing answer synthesis with OpenAI...');
  
  const sampleContext = `The Waterfall Model is a sequential software development process.
  
Key Characteristics:
- Requirements are fixed at the beginning
- Each phase must be completed before the next begins
- Testing occurs after implementation is complete
- Documentation is produced for each phase

Phases:
1. Requirements Analysis
2. System Design
3. Implementation
4. Testing
5. Deployment
6. Maintenance

Advantages:
- Simple and easy to understand
- Well-defined milestones
- Suitable for small projects with clear requirements

Disadvantages:
- Inflexible to changes
- Late testing phase
- Poor risk management`;

  const question = "Explain the waterfall model and its advantages and disadvantages";
  
  try {
    const answer = await synthesizeAnswer({
      question,
      context: sampleContext
    });
    
    console.log('✅ Test successful!');
    console.log('Generated answer:');
    console.log('=================');
    console.log(answer);
    console.log('=================');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAnswer();
