import type { RequestHandler } from '@sveltejs/kit';
import { createGPTPrompt } from '$lib/gptHelper';

interface UserData {
  name: string;
  age: number;
  sex: string;
  weight: number;
  height: number;
  occupation: string;
  lifestyle: string;
}

export const POST: RequestHandler = async (request) => {
  const userData = request.body as UserData;

  try {
    const prompt = createGPTPrompt(userData);
    const gptResponse = await callGPTApi(prompt);
    return {
      status: 200,
      body: {
        message: gptResponse,
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        message: 'An error occurred while processing your request.',
      },
    };
  }
};

async function callGPTApi(prompt: string): Promise<string> {
  // Implement your GPT API call here.
  // This function should call the GPT API with the generated prompt and return the response.
}