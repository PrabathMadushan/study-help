import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY

export type ScoreResult = {
  score: number
  feedback?: string
}

/**
 * Validates user's flashcard answer against the model answer using Google AI (Gemini).
 * Returns a score 0–100. Requires VITE_GEMINI_API_KEY in .env (get key from https://aistudio.google.com/apikey).
 */
export async function validateFlashcardAnswer(
  userAnswer: string,
  modelAnswer: string
): Promise<ScoreResult> {
  if (!apiKey?.trim()) {
    console.warn('VITE_GEMINI_API_KEY is not set')
    return { score: 0, feedback: 'API key not configured. Add VITE_GEMINI_API_KEY to .env' }
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const prompt = `You are an interviewer grading a candidate's answer.

Model (ideal) answer:
"""
${modelAnswer}
"""

Candidate's answer:
"""
${userAnswer.trim() || '(empty)'}
"""

Grade the candidate's answer for correctness and completeness compared to the model answer. Consider:
- Key concepts covered
- Accuracy (no wrong claims)
- Conciseness (bonus for clear, concise answers)

Respond with ONLY a JSON object, no other text:
{"score": <number 0-100>, "feedback": "<one short sentence>"}
Example: {"score": 85, "feedback": "Good coverage of main points; missed one detail about X."}`

  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const json = extractJson(text)
    if (json == null) {
      return { score: 0, feedback: 'Could not parse score from response.' }
    }
    const score = Math.min(100, Math.max(0, Number(json.score) ?? 0))
    return {
      score: Math.round(score),
      feedback: typeof json.feedback === 'string' ? json.feedback : undefined,
    }
  } catch (e) {
    console.error('Gemini validation error', e)
    const message = e instanceof Error ? e.message : String(e)
    const isQuotaOrRateLimit =
      message.includes('429') ||
      message.includes('quota') ||
      message.includes('rate limit') ||
      message.includes('rate-limit') ||
      message.includes('exceeded')
    if (isQuotaOrRateLimit) {
      return {
        score: 0,
        feedback:
          'Rate limit or quota exceeded. Wait a few minutes and try again, or check your quota at https://aistudio.google.com/',
      }
    }
    return {
      score: 0,
      feedback: message || 'Validation failed.',
    }
  }
}

function extractJson(text: string): { score?: number; feedback?: string } | null {
  const trimmed = text.trim()
  const match = trimmed.match(/\{[\s\S]*\}/)
  if (!match) return null
  try {
    return JSON.parse(match[0]) as { score?: number; feedback?: string }
  } catch {
    return null
  }
}
