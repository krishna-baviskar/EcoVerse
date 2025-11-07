
'use server';

/**
 * @fileOverview A flow to validate user-reported sustainable actions and determine the number of eco-points to award.
 *
 * - validateSustainableAction - A function that validates a sustainable action and returns the eco-points.
 * - ValidateSustainableActionInput - The input type for the validateSustainableAction function.
 * - ValidateSustainableActionOutput - The return type for the validateSustainableAction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateSustainableActionInputSchema = z.object({
  action: z.string().describe('The sustainable action performed by the user.'),
  supportingEvidence: z
    .string()
    .optional()
    .describe(
      'Optional supporting evidence for the action, such as a description or a data URI for an image/video.'
    ),
});
export type ValidateSustainableActionInput = z.infer<typeof ValidateSustainableActionInputSchema>;

const ValidateSustainableActionOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the reported action is a valid sustainable action.'),
  ecoPoints: z
    .number()
    .describe('The number of eco-points to award for the action.').optional(),
  reason: z.string().optional().describe('Reason if action is not valid.'),
});
export type ValidateSustainableActionOutput = z.infer<typeof ValidateSustainableActionOutputSchema>;

export async function validateSustainableAction(
  input: ValidateSustainableActionInput
): Promise<ValidateSustainableActionOutput> {
  return validateSustainableActionFlow(input);
}

const validateSustainableActionPrompt = ai.definePrompt({
  name: 'validateSustainableActionPrompt',
  input: {schema: ValidateSustainableActionInputSchema},
  output: {schema: ValidateSustainableActionOutputSchema},
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are an AI validator for the EcoVerse app. Your job is simple and fast: check if an image matches a user's claimed action.

**Your Task:**

1.  **Match Image to Text:** Look at the user's 'Action' text and the provided image. Does the image show what the user described?
    *   If the image visually matches the action text, set \`isValid\` to \`true\` and award a fair number of 'ecoPoints' between 10 and 100.
    *   If the image does not match the text, set \`isValid\` to \`false\` and set the 'reason' to "The provided image does not seem to match the described action."

**User's Submission:**

*   **Action:** \`{{{action}}}\`
{{#if supportingEvidence}}
*   **Supporting Evidence (Image):**
    {{media url=supportingEvidence}}
{{/if}}

Be fast and efficient. Your goal is a quick check, not a deep analysis.`,
});

const validateSustainableActionFlow = ai.defineFlow(
  {
    name: 'validateSustainableActionFlow',
    inputSchema: ValidateSustainableActionInputSchema,
    outputSchema: ValidateSustainableActionOutputSchema,
  },
  async input => {
    const {output} = await validateSustainableActionPrompt(input);
    return output!;
  }
);
