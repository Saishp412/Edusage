require('dotenv').config();
const OpenAI = require('openai');

console.log('🔍 Testing OpenAI API connection...');
console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
console.log('API key starts with sk-proj:', process.env.OPENAI_API_KEY?.startsWith('sk-proj'));

if (!process.env.OPENAI_API_KEY) {
  console.error('❌ No OpenAI API key found in environment');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testConnection() {
  try {
    console.log('🔄 Testing API call...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "Say 'API connection successful' in exactly those words."
        }
      ],
      max_tokens: 10,
      temperature: 0,
    });

    console.log('✅ API call successful!');
    console.log('Response:', response.choices[0].message.content);
    console.log('Usage:', response.usage);
    
  } catch (error) {
    console.error('❌ API call failed:');
    console.error('Error:', error.message);
    console.error('Status:', error.status);
    console.error('Code:', error.code);
    
    if (error.status === 401) {
      console.error('🔑 This appears to be an API key issue');
    } else if (error.status === 429) {
      console.error('⏰ Rate limit exceeded or insufficient credits');
    } else if (error.status === 500) {
      console.error('🔧 OpenAI server error');
    }
  }
}

testConnection();
