require('dotenv').config();
const OpenAI = require('openai');

console.log('Testing OpenAI API integration...');
console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
console.log('API key length:', process.env.OPENAI_API_KEY?.length);

if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY not found in environment variables');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
  try {
    console.log('🔄 Testing OpenAI API call...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant."
        },
        {
          role: "user",
          content: "Say 'OpenAI API is working correctly' in exactly those words."
        }
      ],
      max_tokens: 50,
      temperature: 0.1,
    });

    const answer = response.choices[0].message.content;
    console.log('✅ OpenAI API call successful!');
    console.log('Response:', answer);
    
  } catch (error) {
    console.error('❌ OpenAI API call failed:', error.message);
    if (error.status) {
      console.error('Status code:', error.status);
    }
    if (error.code) {
      console.error('Error code:', error.code);
    }
  }
}

testOpenAI();
