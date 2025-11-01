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

const ScoreBreakdownSchema = z.object({
  factor: z.string(),
  rawValue: z.string(),
  derivedScore: z.number(),
  weight: z.number(),
  contribution: z.number(),
});

const PredictEcoScoreOutputSchema = z.object({
  ecoScore: z.number().describe('The predicted EcoScore (0-100).'),
  explanation: z
    .string()
    .describe('A brief explanation of why the score is high or low.'),
  aqi: z.number().describe('Simulated Air Quality Index.'),
  humidity: z.number().describe('Simulated humidity in percentage.'),
  temperature: z.number().describe('Simulated temperature in Celsius.'),
  breakdown: z.array(ScoreBreakdownSchema).describe('A breakdown of the score calculation.'),
  condition: z.string().describe('The environmental condition (e.g., Good, Moderate).'),
  suggestion: z.string().describe('A suggested action based on the score.'),
});
export type PredictEcoScoreOutput = z.infer<typeof PredictEcoScoreOutputSchema>;

// Dummy function to simulate fetching environmental data
const getEnvironmentalData = (location: string) => {
    // In a real app, this would call external APIs.
    // We'll use pseudorandom data based on location name length.
    const seed = location.length;
    const aqi = (seed * 17) % 450 + 10; // AQI from 10 to 460
    const temperature = (seed * 5) % 40; // Temp up to 40 C
    const humidity = (seed * 7) % 80 + 20; // Humidity from 20 to 100
    return { aqi, temperature, humidity };
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
    temperature: z.number(),
    humidity: z.number(),
  }) },
  output: { schema: z.object({
      ecoScore: z.number(),
      explanation: z.string(),
      breakdown: z.array(ScoreBreakdownSchema),
      condition: z.string(),
      suggestion: z.string(),
  })},
  prompt: `Given the following environmental data for the city of {{{location}}}: {AQI: {{{aqi}}}, Temperature: {{{temperature}}}°C, Humidity: {{{humidity}}}%}, calculate the EcoScore.

  Use the following formula:
  EcoScore = (AirQualityScore * 0.5) + (TempScore * 0.3) + (HumidityScore * 0.2)

  Normalize each factor score from 0-100 as follows:
  1. AirQualityScore = 100 - (AQI / 500 * 100)
  2. TempScore = 100 - (abs(Temp - 24) * 4)
  3. HumidityScore = 100 - abs(Humidity - 55)

  Then, determine the city's condition and a suggested action based on this table:
  - 0–30: Critical (🚨 Highly polluted / unsafe) -> "Avoid outdoor activity, wear mask."
  - 31–50: Poor (⚠️ Low-quality environment) -> "Plant trees, reduce emissions."
  - 51–70: Moderate (🌤 Acceptable but improvable) -> "Conserve power, use public transport."
  - 71–85: Good (🌿 Clean & healthy) -> "Maintain eco habits, spread awareness."
  - 86–100: Excellent (🌎 Green & sustainable) -> "Keep it up — become an Eco Ambassador!"

  Return a response with:
  1. The final 'ecoScore' (rounded to one decimal place).
  2. A 'breakdown' table with columns: "Factor", "Raw Value", "Derived Score", "Weight", "Contribution".
  3. The 'condition' string (e.g., "Good").
  4. A brief 'explanation' of the score.
  5. The corresponding 'suggestion' from the table.
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
