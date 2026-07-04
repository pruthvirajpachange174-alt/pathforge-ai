export const QUIZ_PROMPT = `Generate {count} multiple-choice questions on topic: "{topic}" at {difficulty} difficulty.

Return STRICT JSON:
{
  "topic": "...",
  "questions": [
    {
      "q": "...",
      "options": ["A","B","C","D"],
      "answerIndex": 0,
      "explanation": "..."
    }
  ]
}
Return ONLY valid JSON.`;