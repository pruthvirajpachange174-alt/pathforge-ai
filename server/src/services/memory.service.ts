import { prisma } from '../config/db';

export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;
  return {
    name: user.name,
    year: user.year,
    branch: user.branch,
    skills: user.skills,
    languages: user.languages,
    interests: user.interests,
  };
}

export function formatUserProfile(profile: any): string {
  if (!profile) return 'Anonymous user (no profile).';
  return `Name: ${profile.name ?? 'Unknown'}
Year: ${profile.year ?? 'unspecified'}
Branch: ${profile.branch ?? 'unspecified'}
Languages: ${(profile.languages ?? []).join(', ') || 'none'}
Skills: ${(profile.skills ?? []).join(', ') || 'none'}
Interests: ${(profile.interests ?? []).join(', ') || 'none'}`;
}

export async function getRecentMessages(conversationId: string, limit = 20) {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
    take: limit,
  });
}