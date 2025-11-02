'use server';

/**
 * @fileOverview A flow to predict the EcoScore for a given location.
 *
 * - predictEcoScore - A function that takes a location and returns a predicted EcoScore and explanation.
 * - PredictEcoScoreInput - The input type for the predictEcoScore function.
 * - PredictEcoScoreOutput - The return type for the predictEcoScore function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

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
  breakdown: z
    .array(ScoreBreakdownSchema)
    .describe('A breakdown of the score calculation.'),
  condition: z
    .string()
    .describe('The environmental condition (e.g., Good, Moderate).'),
  suggestion: z.string().describe('A suggested action based on the score.'),
});
export type PredictEcoScoreOutput = z.infer<typeof PredictEcoScoreOutputSchema>;

// Fetches real environmental data from APIs
const getEnvironmentalData = async (location: string) => {
  const openWeatherApiKey = process.env.OPENWEATHERMAP_API_KEY;
  if (!openWeatherApiKey || openWeatherApiKey === 'your_api_key_here') {
    throw new Error(
      'OpenWeatherMap API key is not configured. Please add it to your .env file.'
    );
  }

  const waqiApiKey = process.env.WAQI_API_KEY;
  if (!waqiApiKey || waqiApiKey === 'your_waqi_api_key_here') {
    throw new Error(
      'World Air Quality Index API key is not configured. Please add it to your .env file.'
    );
  }


  // 1. Geocode location to get lat/lon using OpenWeatherMap
  const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${openWeatherApiKey}`;
  const geoResponse = await fetch(geoUrl);
  if (!geoResponse.ok) {
    throw new Error('Failed to fetch location data from OpenWeatherMap.');
  }
  const geoData = await geoResponse.json();
  if (!geoData || geoData.length === 0) {
    throw new Error(`Could not find location: ${location}`);
  }
  const { lat, lon } = geoData[0];

  // 2. Fetch Weather and Air Quality data in parallel
  const weatherPromise = fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=metric`).then(res => {
    if (!res.ok) throw new Error('Failed to fetch weather data.');
    return res.json();
  });

  const airPromise = fetch(`https://api.waqi.info/feed/geo:${lat};${lon}/?token=${waqiApiKey}`).then(res => {
    if (!res.ok) throw new Error('Failed to fetch air quality data from WAQI.');
    return res.json();
  });
  
  const [weatherData, airData] = await Promise.all([weatherPromise, airPromise]);

  const temperature = weatherData.main.temp;
  const humidity = weatherData.main.humidity;
  
  if (airData.status !== 'ok') {
    throw new Error(`Failed to get AQI data: ${airData.data}`);
  }
  const aqi = airData.data.aqi;


  return { aqi, temperature, humidity };
};

export async function predictEcoScore(
  input: PredictEcoScoreInput
): Promise<PredictEcoScoreOutput> {
  return predictEcoScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictEcoScorePrompt',
  input: {
    schema: z.object({
      location: z.string(),
      aqi: z.number(),
      temperature: z.number(),
      humidity: z.number(),
    }),
  },
  output: {
    schema: z.object({
      ecoScore: z.number(),
      explanation: z.string(),
      breakdown: z.array(ScoreBreakdownSchema),
      condition: z.string(),
      suggestion: z.string(),
    }),
  },
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
  async input => {
    const environmentalData = await getEnvironmentalData(input.location);

    const { output } = await prompt({
      ...input,
      ...environmentalData,
    });

    return {
      ...output!,
      ...environmentalData,
    };
  }
);
