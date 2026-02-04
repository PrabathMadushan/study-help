import {
  validateFlashcardAnswer as validateWithGemini,
  type ScoreResult,
} from './gemini'
import { validateFlashcardAnswerGroq } from './groq'

/**
 * Validates the user's flashcard answer using AI. Tries Google Gemini first;
 * if Gemini is not configured or returns an error (e.g. rate limit), falls back to Groq.
 * Requires at least one of VITE_GEMINI_API_KEY or VITE_GROQ_API_KEY in .env.
 */
export async function validateFlashcardAnswer(
  userAnswer: string,
  modelAnswer: string
): Promise<ScoreResult> {
  const geminiResult = await validateWithGemini(userAnswer, modelAnswer)
  const isGeminiError =
    geminiResult.score === 0 &&
    geminiResult.feedback &&
    (geminiResult.feedback.includes('API key not configured') ||
      geminiResult.feedback.includes('Rate limit') ||
      geminiResult.feedback.includes('quota') ||
      geminiResult.feedback.includes('Validation failed'))

  if (!isGeminiError) {
    return geminiResult
  }

  const groqResult = await validateFlashcardAnswerGroq(userAnswer, modelAnswer)
  if (groqResult.score > 0 || !geminiResult.feedback?.includes('API key')) {
    return groqResult
  }
  return groqResult.feedback ? groqResult : geminiResult
}

export type { ScoreResult } from './gemini'
