'use server';

/**
 * @fileOverview This file defines a Genkit flow for the EcoGPT Tutor to suggest personalized actions
 * users can take to improve their EcoScore.
 *
 * @exports suggestEcoActions - An async function that takes user information and EcoScore data to generate
 *                              personalized suggestions for improving their EcoScore.
 * @exports SuggestEcoActionsInput - The input type for the suggestEcoActions function.
 * @exports SuggestEcoActionsOutput - The output type for the suggestEcoActions function, providing a
 *                                  list of actionable suggestions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestEcoActionsInputSchema = z.object({
  userProfile: z
    .string()
    .describe("Briefly describes the user's lifestyle, habits, and current efforts towards sustainability."),
  ecoScore: z.number().describe('The user EcoScore, a numerical representation of their environmental impact.'),
  location: z.string().describe('The user location.'),
});
export type SuggestEcoActionsInput = z.infer<typeof SuggestEcoActionsInputSchema>;

const SuggestEcoActionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of personalized actions the user can take to improve their EcoScore.'),
});
export type SuggestEcoActionsOutput = z.infer<typeof SuggestEcoActionsOutputSchema>;

/**
 * Async function to generate personalized EcoScore improvement suggestions.
 *
 * @param {SuggestEcoActionsInput} input - User profile and EcoScore data.
 * @returns {Promise<SuggestEcoActionsOutput>} - A list of actionable suggestions to improve EcoScore.
 */
export async function suggestEcoActions(input: SuggestEcoActionsInput): Promise<SuggestEcoActionsOutput> {
  return suggestEcoActionsFlow(input);
}

const suggestEcoActionsPrompt = ai.definePrompt({
  name: 'suggestEcoActionsPrompt',
  input: {schema: SuggestEcoActionsInputSchema},
  output: {schema: SuggestEcoActionsOutputSchema},
  prompt: `You are an Eco-Tutor who provides personalized and actionable suggestions to users on how to improve their EcoScore.

  Based on the user's profile, current EcoScore, and location, suggest specific actions they can take to reduce their environmental impact and increase their EcoScore.
  Consider local opportunities, resources, and environmental challenges in your suggestions.

  User Profile: {{{userProfile}}}
  EcoScore: {{{ecoScore}}}
  Location: {{{location}}}

  Suggestions should be clear, concise, and directly related to improving the user's EcoScore.
  The suggestions should also be diverse, covering different aspects of sustainability (e.g., energy consumption, waste reduction, transportation). Return at least three suggestions.
`,
});

const suggestEcoActionsFlow = ai.defineFlow(
  {
    name: 'suggestEcoActionsFlow',
    inputSchema: SuggestEcoActionsInputSchema,
    outputSchema: SuggestEcoActionsOutputSchema,
  },
  async input => {
    const {output} = await suggestEcoActionsPrompt(input);
    return output!;
  }
);
