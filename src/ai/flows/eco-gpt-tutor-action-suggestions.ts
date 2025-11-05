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
  answer: z.string().describe('The answer to the user\'s question, formatted nicely for chat display. Use markdown for lists, bolding, etc.'),
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
  prompt: `You are EcoGPT, a friendly and knowledgeable AI assistant for the EcoVerse app. Your goal is to help users learn about sustainability and improve their environmental impact.

You are having a conversation with a user. Here is the context about them:
- Location: {{{location}}}
- EcoScore: {{{ecoScore}}}

The user's message is:
"{{{userProfile}}}"

Please provide a helpful and encouraging answer to the user's message.
- If they ask for suggestions, give them personalized, actionable ideas based on their context.
- If they ask a question, answer it clearly and concisely.
- If they ask for a fun fact, provide one that is interesting and relevant to sustainability.
- Always format your response in a clear, readable way. Use markdown (like lists or bold text) to improve formatting.
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
