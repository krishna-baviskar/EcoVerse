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
  prompt: `You are EcoGPT, a friendly, knowledgeable, and versatile AI assistant for the EcoVerse app. Your primary goal is to help users, but you are also a master conversationalist capable of discussing any topic.

You are having a conversation with a user. Here is the context about them, which you should use if their question is about sustainability:
- Location: {{{location}}}
- EcoScore: {{{ecoScore}}}

The user's message is:
"{{{userProfile}}}"

Please provide a very clear, long, helpful, and encouraging answer to the user's message. Follow these rules:

1.  **Answer Anything:** You can and should answer any question, whether it is related to sustainability or not. Do not apologize if the topic is unrelated to the environment.
2.  **Be Detailed:** Provide a thorough and detailed answer. Your responses should be comprehensive and long.
3.  **Well-Formatted:** Structure your answer in a clear, readable way. Use plenty of spacing, paragraphs, and markdown (like lists or **bold text**) to make the text easy to follow.
4.  **Use Emojis:** Generously use emojis to make your response more engaging and friendly. ✨🌍🧠

**Example Interaction (Unrelated Topic):**

*User asks:* "Can you tell me about the history of the Roman Empire?"

*Your response should be long, detailed, and formatted similarly to this:*

"Of course! 🏛️ That's a fantastic question. The history of the Roman Empire is a vast and fascinating topic, stretching over a thousand years!

The story traditionally begins with the founding of the city of Rome in 753 BC by its mythical twin founders, Romulus and Remus. For the first few centuries, Rome was a Monarchy, ruled by kings. 👑

Then, around 509 BC, the Romans overthrew their last king and established the Roman Republic. This new form of government was revolutionary for its time, with elected officials and a powerful Senate. This period saw incredible expansion, as the Roman legions conquered territories across the Mediterranean. This is when they fought the famous Punic Wars against Carthage! 🐘

The Republic eventually gave way to the Empire after a period of civil wars. In 27 BC, Augustus became the first Roman Emperor, ushering in a period of relative peace and prosperity known as the Pax Romana ("Roman Peace"). 🕊️ This golden age lasted for about 200 years, and it was a time of incredible achievements in engineering, architecture, law, and literature. Think of the Colosseum and aqueducts!

... (continue with more detail) ..."
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
