/** Defines AI prompt content and construction for Roadmap Prompt. */
export const ROADMAP_PROMPT = `Generate a practical, personalized engineering career roadmap.

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
Return one complete JSON object matching the schema exactly. Do not include markdown fences, comments, or explanatory text. Use arrays of strings for skills, projects, languages, activities, and topics. Keep the whole response compact: use no more than 6 semesters, 3 skills, 1 project, 2 languages, 2 activities, and 1 resource per semester; include at most 4 milestones. Keep each string concise (under 12 words). Do not add fields that are not in the schema.`;

export function buildRoadmapPrompt(profile: any, goal: string) {
  return ROADMAP_PROMPT
    .replace('{year}', profile.year ?? 'unspecified')
    .replace('{branch}', profile.branch ?? 'unspecified')
    .replace('{languages}', (profile.languages ?? []).join(', ') || 'none')
    .replace('{skills}', (profile.skills ?? []).join(', ') || 'none')
    .replace('{interests}', (profile.interests ?? []).join(', ') || 'none')
    .replace('{goal}', () => goal);
}