'use server';

/**
 * @fileOverview A flow to predict the EcoScore for a given location.
 *
 * - predictEcoScore - A function that takes a location and returns a predicted EcoScore and explanation.
 * - PredictEcoScoreInput - The input type for the predictEcoScore function.
 * - PredictEcoScoreOutput - The return type for the predictEcoScore function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PredictEcoScoreInputSchema = z.object({
  location: z.string().describe('The city for which to predict the EcoScore.'),
});
export type PredictEcoScoreInput = z.infer<typeof PredictEcoScoreInputSchema>;

const PredictEcoScoreOutputSchema = z.object({
  ecoScore: z.number().describe('The predicted EcoScore (0-1000).'),
  explanation: z
    .string()
    .describe('A brief explanation of why the score is high or low.'),
  aqi: z.number().describe('Simulated Air Quality Index.'),
  traffic: z.enum(['low', 'moderate', 'high']).describe('Simulated traffic conditions.'),
  temperature: z.number().describe('Simulated temperature in Celsius.'),
});
export type PredictEcoScoreOutput = z.infer<typeof PredictEcoScoreOutputSchema>;

// Dummy function to simulate fetching environmental data
const getEnvironmentalData = (location: string) => {
    // In a real app, this would call external APIs.
    // We'll use pseudorandom data based on location name length.
    const seed = location.length;
    const aqi = (seed * 17) % 300; // AQI up to 300
    const trafficTypes: ['low', 'moderate', 'high'] = ['low', 'moderate', 'high'];
    const traffic = trafficTypes[seed % 3];
    const temperature = (seed * 5) % 45; // Temp up to 45 C
    return { aqi, traffic, temperature };
}

export async function predictEcoScore(
  input: PredictEcoScoreInput
): Promise<PredictEcoScoreOutput> {
  return predictEcoScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictEcoScorePrompt',
  input: { schema: z.object({
    location: z.string(),
    aqi: z.number(),
    traffic: z.enum(['low', 'moderate', 'high']),
    temperature: z.number(),
  }) },
  output: { schema: z.object({
      ecoScore: z.number(),
      explanation: z.string(),
  })},
  prompt: `Given this environmental data for the city of {{{location}}}: {AQI: {{{aqi}}}, traffic: {{{traffic}}}, temperature: {{{temperature}}}C}, calculate a sustainability EcoScore (from 0 to 1000, where 1000 is best) and explain briefly why the score is high or low.

  Use this logic for the calculation:
  1. Normalize values (0-1 range, where 1 is worst):
     - AQI_factor: aqi / 300
     - Traffic_factor: 'low' = 0.2, 'moderate' = 0.5, 'high' = 0.9
     - Temp_factor: temperature / 50 (capped at 1)
  2. Apply weights:
     - AQI: 0.5
     - Traffic: 0.3
     - Temperature: 0.2
  3. Compute final score reduction:
     - reduction = (AQI_factor * 0.5 + Traffic_factor * 0.3 + Temp_factor * 0.2)
  4. Final EcoScore:
     - ecoScore = (1 - reduction) * 1000

  Return only the calculated ecoScore and the explanation.
  `,
});

const predictEcoScoreFlow = ai.defineFlow(
  {
    name: 'predictEcoScoreFlow',
    inputSchema: PredictEcoScoreInputSchema,
    outputSchema: PredictEcoScoreOutputSchema,
  },
  async (input) => {
    const environmentalData = getEnvironmentalData(input.location);

    const { output } = await prompt({
        ...input,
        ...environmentalData,
    });
    
    return {
        ...output!,
        ...environmentalData
    };
  }
);
