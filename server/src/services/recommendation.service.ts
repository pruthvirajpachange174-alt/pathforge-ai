import { prisma } from '../config/db';

export async function recommendHackathons(profile: {
  year?: number | null;
  languages?: string[];
  skills?: string[];
  interests?: string[];
}) {
  const langs = profile.languages ?? [];
  const skills = profile.skills ?? [];
  const interests = profile.interests ?? [];

  const all = await prisma.hackathon.findMany();
  const scored = all.map((h) => {
    let score = 0;
    if (profile.year && profile.year >= 2 && h.difficulty !== 'Advanced') score += 2;
    if (profile.year === 1 && h.difficulty === 'Beginner') score += 3;
    for (const tag of h.tags) {
      if (langs.includes(tag) || skills.includes(tag) || interests.includes(tag)) score += 2;
    }
    for (const d of h.domains) {
      if (interests.includes(d)) score += 3;
    }
    return { hackathon: h, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((s) => s.hackathon);
}

export async function recommendTechnologies(profile: {
  languages?: string[];
  interests?: string[];
}) {
  const all = await prisma.technology.findMany();
  const langs = profile.languages ?? [];
  const interests = profile.interests ?? [];

  return all
    .map((t) => {
      let score = 0;
      for (const l of t.languages) if (langs.includes(l)) score += 2;
      for (const s of t.skills) if (interests.includes(s)) score += 1;
      return { tech: t, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((x) => x.tech);
}