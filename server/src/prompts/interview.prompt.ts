export const INTERVIEW_PROMPT = `Act as a senior interviewer for {company} for a {role} position.
Generate {count} realistic interview questions covering:
- DSA
- Core CS fundamentals
- System Design (if applicable)
- Behavioral (STAR)

Return JSON:
{
  "company": "...",
  "role": "...",
  "questions": [{"type":"DSA|CS|SysDesign|Behavioral","q":"...","hint":"...","idealAnswer":"..."}]
}`;