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
  prompt: `You are a strict but fair AI judge for the EcoVerse app. Your role is to validate user-reported sustainable actions and award EcoPoints. These points are precious, so you must be discerning.

Analyze the user's action and any supporting evidence. The evidence can be a text description or an image/video.

**Your Task:**

1.  **Critically Evaluate:** Scrutinize the action and the evidence. Does the evidence truly support the action claimed? Is the action genuinely sustainable?
2.  **Determine Validity:**
    *   If the evidence is strong and the action is legitimate, set \`isValid\` to \`true\`.
    *   If the evidence is weak, irrelevant, or the action is not sustainable, set \`isValid\` to \`false\`.
3.  **Award Points (if valid):** If the action is valid, assign a fair number of 'ecoPoints' between 1 and 100 based on the action's environmental impact. Be consistent and fair. A small action like using a reusable cup gets fewer points than a big action like planting a tree.
4.  **Provide a Reason (if invalid):** If the action is invalid, you MUST provide a clear, helpful 'reason' explaining why it was not approved.

**User's Submission:**

*   **Action:** \`{{{action}}}\`

{{#if supportingEvidence}}
*   **Supporting Evidence:**
    *   \`{{{supportingEvidence}}}\`
    *   {{media url=supportingEvidence}}
{{/if}}

Use all available information to make your final determination. Return a JSON response in the specified format.`,
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
