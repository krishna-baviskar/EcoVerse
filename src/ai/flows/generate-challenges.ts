'use server';

/**
 * @fileOverview A flow to generate personalized environmental challenges for a user.
 *
 * - generateChallenges - A function that takes a location and EcoScore to return suggested challenges.
 * - GenerateChallengesInput - The input type for the generateChallenges function.
 * - GenerateChallengesOutput - The return type for the generateChallenges function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateChallengesInputSchema = z.object({
  location: z.string().describe('The city or area the user is in.'),
  ecoScore: z.number().describe('The user\'s current EcoScore (0-100).'),
});
export type GenerateChallengesInput = z.infer<typeof GenerateChallengesInputSchema>;

const ChallengeSchema = z.object({
    title: z.string().describe('A short, catchy title for the challenge.'),
    description: z.string().describe('A 2-3 sentence summary of what the user needs to do and why it matters.'),
    ecoPoints: z.number().describe('The number of EcoPoints awarded for completing the challenge.'),
});
export type Challenge = z.infer<typeof ChallengeSchema>;

const GenerateChallengesOutputSchema = z.object({
  challenges: z.array(ChallengeSchema).describe('A list of 8-12 personalized environmental challenges.'),
});
export type GenerateChallengesOutput = z.infer<typeof GenerateChallengesOutputSchema>;

export async function generateChallenges(
  input: GenerateChallengesInput
): Promise<GenerateChallengesOutput> {
  return generateChallengesFlow(input);
}

const generateChallengesPrompt = ai.definePrompt({
  name: 'generateChallengesPrompt',
  input: { schema: GenerateChallengesInputSchema },
  output: { schema: GenerateChallengesOutputSchema },
  prompt: `You are an eco-coach AI. Your goal is to create personalized environmental challenges for a user based on their location and their current EcoScore.

The EcoScore is a measure from 0-100, where higher is better.
- A low EcoScore (< 50) means the user has a high environmental impact, so suggest fundamental, high-impact challenges.
- A high EcoScore (> 75) means the user is already doing well, so suggest more advanced or community-oriented challenges.

User's Location: {{{location}}}
User's EcoScore: {{{ecoScore}}}

Generate a list of 8 to 12 creative and actionable challenges. For each challenge, provide:
1.  A short, catchy 'title'.
2.  A 'description' that is 2-3 sentences long, explaining what the user needs to do and why it is beneficial for the environment.
3.  Assign a fair number of 'ecoPoints' between 20 and 150 based on the challenge's difficulty and impact.
`,
});

const generateChallengesFlow = ai.defineFlow(
  {
    name: 'generateChallengesFlow',
    inputSchema: GenerateChallengesInputSchema,
    outputSchema: GenerateChallengesOutputSchema,
  },
  async (input) => {
    const { output } = await generateChallengesPrompt(input);
    return output!;
  }
);
