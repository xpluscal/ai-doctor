import { error } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createGPTPrompt, createDiagnosisPrompt, createTreatmentsPrompt, createNextStepsPrompt } from '$lib/gptHelper';
import { Configuration, OpenAIApi } from "openai";
import { env } from '$env/dynamic/private';
import type { UserData } from '$lib/gptHelper';

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const actions = {
  submit: async ({ cookies, request, locals }) => {
    const form = await request.formData();
    // console.log("FORM:");

    // console.log(Object.fromEntries(form));

    const userData:UserData = {
        ...Object.fromEntries(form)
    } as UserData;

    try {
        const diagnosis = createDiagnosisPrompt(userData);
        const diagnosisResponse = await callGPTApi(diagnosis);

        // console.log(diagnosisResponse);

        const parseDiagnosticResponse = JSON.parse(diagnosisResponse);

        const treatments:any[] = [];
        const nextSteps:any[] = [];

        for (const diagnosis of parseDiagnosticResponse) {
            const treatment = createTreatmentsPrompt(JSON.stringify(diagnosis));
            // console.log(treatment);
            const treatmentResponse = await callGPTApi(treatment);
            // console.log(treatmentResponse);
            treatments.push(JSON.parse(treatmentResponse));
            const nextStep = createNextStepsPrompt(JSON.stringify(diagnosis));
            // console.log(nextStep);
            const nextStepResponse = await callGPTApi(nextStep);
            // console.log(nextStepResponse);
            nextSteps.push(JSON.parse(nextStepResponse));
        }

        const combinedArray = parseDiagnosticResponse.map((diagnosis:any, index:number) => {
        return {
            diagnosis: diagnosis,
            treatments: treatments[index],
            nextSteps: nextSteps[index],
        };
});

        return {
            result: combinedArray
        };
    } catch (e) {
        console.log(e);
        throw error(500, 'An error occurred while processing your request.');
    }

    return {
        status: 200,
        success: true
    }
  }
} satisfies Actions;

async function callGPTApi(prompt:string) {
  const response = await openai.createCompletion({
    model: 'text-davinci-003', // Use the desired GPT-3.5 engine
    prompt: prompt,
    max_tokens: 150,
    n: 1,
    stop: null,
    temperature: 0.8,
  });

  return response?.data?.choices[0].text.trim();
}