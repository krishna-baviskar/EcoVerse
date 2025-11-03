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

const calculateEcoScore = (aqi: number, temperature: number, humidity: number) => {
    const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
    
    // 1. Normalize scores (0-100)
    const airQualityScore = clamp(100 - (aqi / 500 * 100), 0, 100);
    const tempScore = clamp(100 - (Math.abs(temperature - 24) * 4), 0, 100);
    const humidityScore = clamp(100 - Math.abs(humidity - 55), 0, 100);
    
    // 2. Define weights
    const weights = {
        aqi: 0.5,
        temp: 0.3,
        humidity: 0.2,
    };
    
    // 3. Calculate weighted contributions
    const aqiContribution = airQualityScore * weights.aqi;
    const tempContribution = tempScore * weights.temp;
    const humidityContribution = humidityScore * weights.humidity;
    
    // 4. Calculate final EcoScore
    const ecoScore = aqiContribution + tempContribution + humidityContribution;
    
    // 5. Determine condition and suggestion
    let condition = '';
    let suggestion = '';
    let explanation = '';
    
    if (ecoScore <= 30) {
        condition = 'Critical';
        suggestion = 'Avoid outdoor activity, wear mask.';
        explanation = 'The environment is in a critical state. This score indicates hazardous air quality, extreme temperatures, or other severe weather conditions that pose significant health risks. Immediate precautionary measures are strongly advised.';
    } else if (ecoScore <= 50) {
        condition = 'Poor';
        suggestion = 'Plant trees, reduce emissions.';
        explanation = 'Environmental conditions are poor, likely due to high pollution levels or uncomfortable weather. Air quality may be unhealthy for sensitive groups, and it is advisable to take collective steps to improve local environmental factors.';
    } else if (ecoScore <= 70) {
        condition = 'Moderate';
        suggestion = 'Conserve power, use public transport.';
        explanation = 'The environment is in an acceptable but mediocre state. While not immediately hazardous, there is clear room for improvement. Air quality, temperature, or humidity are outside their ideal ranges, impacting overall comfort and long-term sustainability.';
    } else if (ecoScore <= 85) {
        condition = 'Good';
        suggestion = 'Maintain eco habits, spread awareness.';
        explanation = 'The local environment is clean and healthy. Air quality is good, and weather conditions are generally pleasant. Your current location offers a great foundation for sustainable living. Keep up the great work!';
    } else {
        condition = 'Excellent';
        suggestion = 'Keep it up — become an Eco Ambassador!';
        explanation = 'Congratulations! The environment is in an excellent, sustainable state. This score reflects pristine air quality and ideal weather conditions. Your location is a prime example of a healthy, green community. Your positive actions help maintain it.';
    }

    // 6. Create breakdown
    const breakdown = [
        {
            factor: "Air Quality",
            rawValue: `${aqi.toFixed(0)} AQI`,
            derivedScore: airQualityScore,
            weight: weights.aqi,
            contribution: aqiContribution,
        },
        {
            factor: "Temperature",
            rawValue: `${temperature.toFixed(1)}°C`,
            derivedScore: tempScore,
            weight: weights.temp,
            contribution: tempContribution,
        },
        {
            factor: "Humidity",
            rawValue: `${humidity.toFixed(0)}%`,
            derivedScore: humidityScore,
            weight: weights.humidity,
            contribution: humidityContribution,
        },
    ];

    return {
        ecoScore,
        explanation,
        breakdown,
        condition,
        suggestion,
    };
}


export async function predictEcoScore(
  input: PredictEcoScoreInput
): Promise<PredictEcoScoreOutput> {
  return predictEcoScoreFlow(input);
}

const predictEcoScoreFlow = ai.defineFlow(
  {
    name: 'predictEcoScoreFlow',
    inputSchema: PredictEcoScoreInputSchema,
    outputSchema: PredictEcoScoreOutputSchema,
  },
  async input => {
    const environmentalData = await getEnvironmentalData(input.location);

    const calculationResult = calculateEcoScore(
        environmentalData.aqi,
        environmentalData.temperature,
        environmentalData.humidity
    );

    return {
      ...calculationResult,
      ...environmentalData,
    };
  }
);
