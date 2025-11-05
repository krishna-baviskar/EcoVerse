
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
  completedActions: z.array(z.string()).optional().describe('A list of actions the user has already completed and received points for.'),
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
  prompt: `You are a very strict but fair AI judge for the EcoVerse app. Your role is to validate user-reported sustainable actions and award EcoPoints. These points are precious, so you must be discerning and prevent users from "gaming the system".

**Your Task:**

1.  **Critically Evaluate:** Scrutinize the action and any evidence. Does the evidence truly support the action claimed? Is the action genuinely sustainable?
2.  **Check for Duplicates:** This is the most important step. The user has already completed the actions in the \`completedActions\` list. Compare the current action with this list. If the new action is the same, or substantially similar, to an action they have already been awarded points for, you **MUST** set \`isValid\` to \`false\` and provide a reason like "You have already earned points for this or a very similar activity."
3.  **Determine Validity:**
    *   If the action is legitimate AND it is a new, unique action not in their history, set \`isValid\` to \`true\`.
    *   If the evidence is weak, the action isn't sustainable, OR it's a repeat of a past action, set \`isValid\` to \`false\`.
4.  **Award Points (if valid):** If the action is valid and new, assign a fair number of 'ecoPoints' between 1 and 100 based on the action's environmental impact. Be consistent. A small action like using a reusable cup gets fewer points than a big action like planting a tree.
5.  **Provide a Reason (if invalid):** If the action is invalid (for any reason, including being a duplicate), you MUST provide a clear, helpful 'reason' explaining why.

**User's Submission:**

*   **Action:** \`{{{action}}}\`
{{#if supportingEvidence}}
*   **Supporting Evidence:** \`{{{supportingEvidence}}}\`
    *   {{media url=supportingEvidence}}
{{/if}}

{{#if completedActions}}
*   **User's Completed Actions History (Do not approve if the new action is a repeat of one of these):**
    {{#each completedActions}}
    *   {{this}}
    {{/each}}
{{/if}}

Use all available information to make your final determination. Be strict about repeat submissions.`,
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
