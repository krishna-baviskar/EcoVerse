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
  prompt: `You are an AI assistant that validates user-reported sustainable actions and assigns eco-points.
Analyze the user's action and any supporting evidence provided.

User's reported action:
Action: {{{action}}}

{{#if supportingEvidence}}
Supporting Evidence:
{{{supportingEvidence}}}
{{media url=supportingEvidence}}
{{/if}}

The supporting evidence may be text, or it could be a data URI for an image or video. Use all available information to make your determination.
Determine if the action is a valid sustainable action based on the evidence. If it is valid, award eco-points between 1 and 100 based on the environmental impact.
If the action is not valid, explain why in the 'reason' field.

Return a JSON response in the specified format.
`,
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
