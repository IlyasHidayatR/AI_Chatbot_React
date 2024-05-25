import { Groq } from 'groq-sdk'

const groq_key = import.meta.env.VITE_GROQ_AI_KEY;

const groq = new Groq({
  apiKey: groq_key,
  dangerouslyAllowBrowser: true,
});

export const requestAI = async (query) => {
    const response = await groq.chat.completions.create({
        messages: [
            {
                role: 'user',
                content: query,
            }
        ],
        model: 'llama3-8b-8192',
    });
    return response;
}