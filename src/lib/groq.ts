import type { ScoreResult } from './gemini'

const apiKey = import.meta.env.VITE_GROQ_API_KEY

const GROQ_CHAT_URL = 'https://api.groq.com/openai/v1/chat/completions'

const GRADING_PROMPT = (modelAnswer: string, userAnswer: string) =>
  `You are an interviewer grading a candidate's answer.

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

/**
 * Validates user's flashcard answer using Groq (OpenAI-compatible API).
 * Returns a score 0–100. Requires VITE_GROQ_API_KEY in .env (get key from https://console.groq.com/keys).
 */
export async function validateFlashcardAnswerGroq(
  userAnswer: string,
  modelAnswer: string
): Promise<ScoreResult> {
  if (!apiKey?.trim()) {
    return {
      score: 0,
      feedback: 'Groq API key not configured. Add VITE_GROQ_API_KEY to .env',
    }
  }

  try {
    const res = await fetch(GROQ_CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: GRADING_PROMPT(modelAnswer, userAnswer),
          },
        ],
        max_tokens: 256,
        temperature: 0.2,
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      const isRateLimit = res.status === 429
      return {
        score: 0,
        feedback: isRateLimit
          ? 'Groq rate limit exceeded. Wait a moment and try again.'
          : text || `Groq API error: ${res.status}`,
      }
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>
    }
    const content = data.choices?.[0]?.message?.content
    if (!content) {
      return { score: 0, feedback: 'No response from Groq.' }
    }

    const json = extractJson(content)
    if (json == null) {
      return { score: 0, feedback: 'Could not parse score from Groq response.' }
    }
    const score = Math.min(100, Math.max(0, Number(json.score) ?? 0))
    return {
      score: Math.round(score),
      feedback: typeof json.feedback === 'string' ? json.feedback : undefined,
    }
  } catch (e) {
    console.error('Groq validation error', e)
    const message = e instanceof Error ? e.message : String(e)
    return { score: 0, feedback: message || 'Groq validation failed.' }
  }
}
