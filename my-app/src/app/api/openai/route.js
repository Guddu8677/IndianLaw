import { OpenAI } from 'openai';

const OPENAI_API_KEY = 'your-openai-api-key'; // Use a secure environment variable

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json(); // Parse the incoming JSON
    const { query, language } = body;

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!language) {
      return new Response(
        JSON.stringify({ error: 'Language is required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Prepare the OpenAI prompt
    const prompt = `
      You are a legal assistant specializing in Indian law.
      Respond to the following query in ${language === 'hi' ? 'Hindi' : 'English'}.
      Provide references to Indian legal acts like the Constitution, IPC, CrPC, or other laws:
      "${query}"
    `;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: `You are a legal assistant.` },
        { role: 'user', content: prompt },
      ],
    });

    const resultContent = response.choices?.[0]?.message?.content;

    if (!resultContent) {
      throw new Error('No response content from OpenAI.');
    }

    return new Response(
      JSON.stringify({ result: resultContent }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error.message);

    return new Response(
      JSON.stringify({ error: 'Failed to fetch response from OpenAI.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
