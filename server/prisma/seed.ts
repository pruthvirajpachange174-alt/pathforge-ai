
import { prisma } from '../src/config/db';
import techCareers from '../src/data/tech-careers.json';
import { logger } from '../src/utils/logger';


async function main() {
  logger.info('🌱 Seeding database…');

  for (const c of techCareers as any[]) {
    await prisma.techCareer.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name,
        description: c.description,
        requiredSkills: c.requiredSkills,
        learningRoadmap: c.learningRoadmap,
        salaryRange: c.salaryRange,
        demandLevel: c.demandLevel,
        companiesHiring: c.companiesHiring,
        resources: c.resources,
      },
      create: {
        slug: c.slug,
        name: c.name,
        description: c.description,
        requiredSkills: c.requiredSkills,
        learningRoadmap: c.learningRoadmap,
        salaryRange: c.salaryRange,
        demandLevel: c.demandLevel,
        companiesHiring: c.companiesHiring,
        resources: c.resources,
      },
    });
  }
  logger.info(`✅ ${techCareers.length} tech careers`);

  
  

  logger.info('🎉 Seed complete.');
  await prisma.$disconnect();
}

main().catch((e) => {
  logger.error(e);
  process.exit(1);
});

