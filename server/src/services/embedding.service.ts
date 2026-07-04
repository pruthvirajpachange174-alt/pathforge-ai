import OpenAI from 'openai';
import { env } from '../config/env';

const openai = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;

export async function generateEmbedding(text: string): Promise<number[]> {
  if (!openai) throw new Error('OpenAI key required for embeddings');
  const res = await openai.embeddings.create({
    model: env.EMBEDDING_MODEL,
    input: text.slice(0, 8000),
  });
  return res.data[0].embedding;
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  if (!openai) throw new Error('OpenAI key required for embeddings');
  const res = await openai.embeddings.create({
    model: env.EMBEDDING_MODEL,
    input: texts.map((t) => t.slice(0, 8000)),
  });
  return res.data.map((d) => d.embedding);
}