/** Runs the Seed backend task. */
import { prisma } from '../config/db';
import placementExams from '../data/placement-exams.json';
import governmentExams from '../data/government-exams.json';
import technologies from '../data/technologies.json';
import languages from '../data/languages.json';
import hackathons from '../data/hackathons.json';
import colleges from '../data/colleges.json';
import techCareers from '../data/tech-careers.json';
import { importIndiaDirectory } from '../services/indiaDirectory.service';
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

  for (const career of techCareers as any[]) {
    await prisma.techCareer.upsert({
      where: { slug: career.slug },
      update: {
        name: career.name,
        description: career.description,
        requiredSkills: career.requiredSkills,
        learningRoadmap: career.learningRoadmap,
        salaryRange: career.salaryRange,
        demandLevel: career.demandLevel,
        companiesHiring: career.companiesHiring,
        resources: career.resources,
      },
      create: career,
    });
  }
  logger.info(`${techCareers.length} tech careers`);

  const legacyCollegeNames: Record<string, string[]> = {
    'Indian Institute of Technology Bombay': ['IIT Bombay'],
    'Indian Institute of Technology Delhi': ['IIT Delhi'],
    'Indian Institute of Technology Madras': ['IIT Madras'],
    'National Institute of Technology Tiruchirappalli': ['NIT Trichy'],
  };
  for (const college of colleges) {
    const existing = await prisma.college.findFirst({
      where: {
        OR: [
          { name: college.name, city: college.city },
          { name: { in: legacyCollegeNames[college.name] ?? [] } },
        ],
      },
    });
    if (existing) {
      await prisma.college.update({ where: { id: existing.id }, data: college });
    } else {
      await prisma.college.create({ data: college });
    }
  }
  logger.info(`${colleges.length} colleges seeded`);

  const directorySummary = await importIndiaDirectory();
  logger.info(
    `${directorySummary.total} India directory records (${directorySummary.create} new, ${directorySummary.update} updated)`,
  );

  logger.info('🎉 Seed complete.');
  await prisma.$disconnect();
}

main().catch((e) => { logger.error(e); process.exit(1); });