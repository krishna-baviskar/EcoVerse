import { config } from 'dotenv';
config(); 

import '@/ai/flows/validate-sustainable-actions.ts';
import '@/ai/flows/eco-gpt-tutor-action-suggestions.ts';
import '@/ai/flows/eco-gpt-tutor-initial-explanation.ts';
import '@/ai/flows/generate-quiz.ts';
import '@/ai/flows/predict-ecoscore.ts';
import '@/ai/flows/generate-challenges.ts';
