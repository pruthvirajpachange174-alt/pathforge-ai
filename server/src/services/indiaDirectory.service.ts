import { prisma } from '../config/db';
import indiaDirectory from '../data/india-directory.json';

export async function importIndiaDirectory(dryRun = false) {
  const entries = indiaDirectory;
  const existing = await prisma.indiaDirectoryEntry.findMany({
    where: { slug: { in: entries.map((entry) => entry.slug) } },
    select: { slug: true },
  });
  const existingSlugs = new Set(existing.map((entry) => entry.slug));
  const summary = {
    total: entries.length,
    create: entries.filter((entry) => !existingSlugs.has(entry.slug)).length,
    update: entries.filter((entry) => existingSlugs.has(entry.slug)).length,
  };

  if (!dryRun) {
    for (const entry of entries) {
      await prisma.indiaDirectoryEntry.upsert({
        where: { slug: entry.slug },
        update: entry,
        create: entry,
      });
    }
  }

  return summary;
}
