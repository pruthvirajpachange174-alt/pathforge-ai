import { prisma } from '../config/db';
import placementExams from '../data/placement-exams.json';
import governmentExams from '../data/government-exams.json';
import technologies from '../data/technologies.json';
import languages from '../data/languages.json';
import hackathons from '../data/hackathons.json';
import { logger } from '../utils/logger';

async function main() {
  logger.info('🌱 Seeding database…');

  for (const e of placementExams as any[]) {
    await prisma.placementExam.upsert({
      where: { slug: e.slug },
      update: e,
      create: e,
    });
  }
  logger.info(`✅ ${placementExams.length} placement exams`);

  for (const e of governmentExams as any[]) {
    await prisma.governmentExam.upsert({
      where: { slug: e.slug },
      update: e,
      create: e,
    });
  }
  logger.info(`✅ ${governmentExams.length} government exams`);

  for (const t of technologies as any[]) {
    await prisma.technology.upsert({
      where: { slug: t.slug },
      update: t,
      create: t,
    });
  }
  logger.info(`✅ ${technologies.length} technologies`);

  for (const l of languages as any[]) {
    await prisma.language.upsert({
      where: { slug: l.slug },
      update: l,
      create: l,
    });
  }
  logger.info(`✅ ${languages.length} languages`);

  for (const h of hackathons as any[]) {
    await prisma.hackathon.upsert({
      where: { slug: h.slug },
      update: h,
      create: h,
    });
  }
  logger.info(`✅ ${hackathons.length} hackathons`);

  logger.info('🎉 Seed complete.');
  await prisma.$disconnect();
}

main().catch((e) => { logger.error(e); process.exit(1); });