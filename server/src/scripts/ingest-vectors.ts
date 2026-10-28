/** Runs the Ingest Vectors backend task. */
import { prisma } from '../config/db';
import { env } from '../config/env';
import { generateEmbeddings } from '../services/embedding.service';
import { upsertVectors } from '../services/vector-store.service';
import { logger } from '../utils/logger';

async function main() {
  logger.info(`📦 Vector database: ${env.VECTOR_DB}`);

  logger.info('📥 Fetching database rows…');
  const exams = await prisma.placementExam.findMany();
  const govExams = await prisma.governmentExam.findMany();
  const techs = await prisma.technology.findMany();
  const langs = await prisma.language.findMany();
  const hacks = await prisma.hackathon.findMany();
  const careers = await prisma.techCareer.findMany();
  const colleges = await prisma.college.findMany();

  const items: { id: string; text: string; source: string; type: string }[] = [];

  for (const e of exams) {
    items.push({
      id: `exam-${e.slug}`,
      text: `Placement guide: ${e.company}. Eligibility: ${e.eligibility}. Assessment pattern and schedule: ${JSON.stringify(e.examPattern)}. Topics: ${e.topics.join(', ')}. Preparation roadmap: ${JSON.stringify(e.roadmap)}. Hiring process: ${JSON.stringify(e.hiringProcess)}. Compensation note: ${e.expectedSalary}. Official resources: ${JSON.stringify(e.resources)}. Preparation notes: ${e.previousTrends}`,
      source: `Placement Exam - ${e.company}`,
      type: 'placement',
    });
  }
  for (const e of govExams) {
    items.push({
      id: `gov-${e.slug}`,
      text: `Government exam: ${e.name} (${e.category}). Who should take it: ${e.whoShouldTake}. Eligibility: ${e.eligibility}. Pattern: ${JSON.stringify(e.pattern)}. Schedule and confirmed dates: ${JSON.stringify(e.schedule)}. Syllabus: ${JSON.stringify(e.syllabus)}. Opportunities: ${e.opportunities}. Official source: ${e.officialUrl}`,
      source: `Government Exam - ${e.name}`,
      type: 'gov',
    });
  }
  for (const t of techs) {
    items.push({
      id: `tech-${t.slug}`,
      text: `Technology: ${t.name} (${t.category}). ${t.description}. Skills: ${t.skills.join(', ')}. Languages: ${t.languages.join(', ')}. Learning roadmap: ${JSON.stringify(t.roadmap)}. Project ideas: ${JSON.stringify(t.projects)}. Certifications: ${t.certifications.join(', ')}. Compensation context: ${t.salary}. Companies: ${t.companies.join(', ')}. Future context: ${t.futureDemand}`,
      source: `Technology - ${t.name}`,
      type: 'tech',
    });
  }
  for (const l of langs) {
    items.push({
      id: `lang-${l.slug}`,
      text: `Language: ${l.name}. Used for: ${l.usedFor.join(', ')}. Companies: ${l.companies.join(', ')}. Strengths: ${l.pros.join('; ')}. Trade-offs: ${l.cons.join('; ')}. Example projects: ${l.exampleProjects.join(', ')}. Future context: ${l.futureScope}`,
      source: `Language - ${l.name}`,
      type: 'lang',
    });
  }
  for (const h of hacks) {
    items.push({
      id: `hack-${h.slug}`,
      text: `Hackathon: ${h.name} by ${h.organizer}. Type: ${h.type}. Schedule: ${h.registrationPeriod}. Eligibility: ${h.eligibility}. Team size: ${h.teamSize}. Selection: ${h.selectionProcess}. Challenge: ${h.problemStatements.join('; ')}. Domains: ${h.domains.join(', ')}. Judging criteria: ${JSON.stringify(h.judgingCriteria)}. Prize terms: ${h.prizePool}. Benefits: ${JSON.stringify(h.benefits)}. Timeline: ${JSON.stringify(h.timeline)}. Tips: ${h.tips.join('; ')}. Official source: ${h.website}`,
      source: `Hackathon - ${h.name}`,
      type: 'hackathon',
    });
  }
  for (const career of careers) {
    items.push({
      id: `career-${career.slug}`,
      text: `Technology career: ${career.name}. ${career.description}. Skills: ${career.requiredSkills.join(', ')}. Roadmap: ${JSON.stringify(career.learningRoadmap)}. Compensation context: ${career.salaryRange}. Demand label: ${career.demandLevel}. Companies: ${career.companiesHiring.join(', ')}. Learning resources: ${JSON.stringify(career.resources)}`,
      source: `Career - ${career.name}`,
      type: 'career',
    });
  }
  for (const college of colleges) {
    items.push({
      id: `college-${college.id}`,
      text: `Indian higher education institution: ${college.name}, ${college.city}. ${college.description ?? ''}. Courses and study areas: ${college.courses.join(', ')}. Facilities: ${college.facilities.join(', ')}. Ranking note: ${college.ranking ?? 'Check official current rankings'}. Official website: ${college.website ?? ''}`,
      source: `College - ${college.name}`,
      type: 'college',
    });
  }

  logger.info(`🧮 Generating embeddings for ${items.length} chunks…`);
  const BATCH = 50;
  for (let i = 0; i < items.length; i += BATCH) {
    const batch = items.slice(i, i + BATCH);
    const embeddings = await generateEmbeddings(batch.map((b) => b.text));
    const vectors = batch.map((b, idx) => ({
      id: b.id,
      embedding: embeddings[idx],
      text: b.text,
      metadata: { source: b.source, type: b.type },
    }));
    await upsertVectors(vectors);
    logger.info(`  Upserted ${i + batch.length}/${items.length}`);
  }

  logger.info('✅ Vector ingestion complete.');
  process.exit(0);
}

main().catch((e) => { logger.error(e); process.exit(1); });