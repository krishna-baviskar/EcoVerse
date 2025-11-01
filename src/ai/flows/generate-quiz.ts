'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating quizzes.
 *
 * @exports generateQuiz - An async function that creates a quiz on a given topic.
 * @exports GenerateQuizInput - The input type for the generateQuiz function.
 * @exports GenerateQuizOutput - The output type for the generateQuiz function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateQuizInputSchema = z.object({
  topic: z.string().describe('The topic for the quiz.'),
  questionCount: z.number().describe('The number of questions to generate.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const QuizQuestionSchema = z.object({
    question: z.string(),
    options: z.array(z.string()),
    answer: z.string(),
});

const GenerateQuizOutputSchema = z.object({
  questions: z.array(QuizQuestionSchema).describe('A list of quiz questions.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

/**
 * Async function to generate a quiz.
 *
 * @param {GenerateQuizInput} input - The topic and number of questions for the quiz.
 * @returns {Promise<GenerateQuizOutput>} - A list of quiz questions.
 */
export async function generateQuiz(
  input: GenerateQuizInput
): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const generateQuizPrompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: { schema: GenerateQuizInputSchema },
  output: { schema: GenerateQuizOutputSchema },
  prompt: `You are an AI assistant that generates quizzes. Generate a quiz with {{{questionCount}}} multiple-choice questions about {{{topic}}}. For each question, provide 4 options and the correct answer.`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async input => {
    const { output } = await generateQuizPrompt(input);
    return output!;
  }
);
