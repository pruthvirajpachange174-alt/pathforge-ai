export const ROADMAP_PROMPT = `Generate a detailed, personalized engineering career roadmap.

Student Profile:
- Year: {year}
- Branch: {branch}
- Known Languages: {languages}
- Skills: {skills}
- Interests: {interests}
- Goal: {goal}

Output STRICT JSON in this schema:
{
  "title": "...",
  "goal": "...",
  "summary": "...",
  "semesters": [
    {
      "semester": "Sem 1",
      "focus": "...",
      "skills": [...],
      "projects": [...],
      "languages": [...],
      "activities": [...],
      "resources": [{"name":"...","url":"..."}]
    }
  ],
  "milestones": [{"month":"...","target":"..."}],
  "placementPrep": {"month":"...","topics":[...]},
  "finalAdvice": "..."
}
Return ONLY valid JSON, no markdown fences.`;

export function buildRoadmapPrompt(profile: any, goal: string) {
  return ROADMAP_PROMPT
    .replace('{year}', profile.year ?? 'unspecified')
    .replace('{branch}', profile.branch ?? 'unspecified')
    .replace('{languages}', (profile.languages ?? []).join(', ') || 'none')
    .replace('{skills}', (profile.skills ?? []).join(', ') || 'none')
    .replace('{interests}', (profile.interests ?? []).join(', ') || 'none')
    .replace('{goal}', goal);
}