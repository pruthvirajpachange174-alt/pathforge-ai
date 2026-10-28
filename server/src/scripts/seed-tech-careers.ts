/** Runs the Seed Tech Careers backend task. */
import { prisma } from '../config/db';
import techCareers from '../data/tech-careers.json';

async function main() {
  console.log('🌱 Seeding tech careers…');

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

  console.log(`✅ ${techCareers.length} tech careers`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

