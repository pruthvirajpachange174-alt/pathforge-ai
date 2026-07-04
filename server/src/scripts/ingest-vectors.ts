import { prisma } from '../config/db';
import { getIndex } from '../config/pinecone';
import { generateEmbeddings } from '../services/embedding.service';
import { logger } from '../utils/logger';

async function main() {
  const index = getIndex();
  if (!index) { logger.error('Pinecone not configured'); process.exit(1); }

  logger.info('📥 Fetching database rows…');
  const exams = await prisma.placementExam.findMany();
  const govExams = await prisma.governmentExam.findMany();
  const techs = await prisma.technology.findMany();
  const langs = await prisma.language.findMany();
  const hacks = await prisma.hackathon.findMany();

  const items: { id: string; text: string; source: string; type: string }[] = [];

  for (const e of exams) {
    items.push({
      id: `exam-${e.slug}`,
      text: `Placement exam: ${e.company}. Eligibility: ${e.eligibility}. Topics: ${e.topics.join(', ')}. Difficulty: ${e.difficulty}. Salary: ${e.expectedSalary}. Trends: ${e.previousTrends}`,
      source: `Placement Exam - ${e.company}`,
      type: 'placement',
    });
  }
  for (const e of govExams) {
    items.push({
      id: `gov-${e.slug}`,
      text: `Government exam: ${e.name} (${e.category}). Who: ${e.whoShouldTake}. Eligibility: ${e.eligibility}. Opportunities: ${e.opportunities}`,
      source: `Government Exam - ${e.name}`,
      type: 'gov',
    });
  }
  for (const t of techs) {
    items.push({
      id: `tech-${t.slug}`,
      text: `Technology: ${t.name} (${t.category}). ${t.description}. Skills: ${t.skills.join(', ')}. Languages: ${t.languages.join(', ')}. Salary: ${t.salary}. Companies: ${t.companies.join(', ')}. Future: ${t.futureDemand}`,
      source: `Technology - ${t.name}`,
      type: 'tech',
    });
  }
  for (const l of langs) {
    items.push({
      id: `lang-${l.slug}`,
      text: `Language: ${l.name}. Used for: ${l.usedFor.join(', ')}. Companies: ${l.companies.join(', ')}. Pros: ${l.pros.join('; ')}. Cons: ${l.cons.join('; ')}. Future: ${l.futureScope}`,
      source: `Language - ${l.name}`,
      type: 'lang',
    });
  }
  for (const h of hacks) {
    items.push({
      id: `hack-${h.slug}`,
      text: `Hackathon: ${h.name} by ${h.organizer}. Type: ${h.type}. Eligibility: ${h.eligibility}. Domains: ${h.domains.join(', ')}. Prize: ${h.prizePool}. Tips: ${h.tips.join('; ')}`,
      source: `Hackathon - ${h.name}`,
      type: 'hackathon',
    });
  }

  logger.info(`🧮 Generating embeddings for ${items.length} chunks…`);
  const BATCH = 50;
  for (let i = 0; i < items.length; i += BATCH) {
    const batch = items.slice(i, i + BATCH);
    const embeddings = await generateEmbeddings(batch.map((b) => b.text));
    const vectors = batch.map((b, idx) => ({
      id: b.id,
      values: embeddings[idx],
      metadata: { text: b.text, source: b.source, type: b.type },
    }));
    await index.upsert(vectors);
    logger.info(`  Upserted ${i + batch.length}/${items.length}`);
  }

  logger.info('✅ Vector ingestion complete.');
  process.exit(0);
}

main().catch((e) => { logger.error(e); process.exit(1); });