/** Provides backend functionality for Rag Service. */
import { generateEmbedding } from './embedding.service';
import { queryVectors } from './vector-store.service';
import { logger } from '../utils/logger';

export interface RetrievedChunk {
  id: string;
  score: number;
  text: string;
  source: string;
  metadata?: Record<string, unknown>;
}

export async function retrieveContext(query: string, topK = 5): Promise<RetrievedChunk[]> {
  try {
    const embedding = await generateEmbedding(query);
    return await queryVectors(embedding, topK);
  } catch (err: unknown) {
    logger.error(`RAG retrieval failed: ${err instanceof Error ? err.message : String(err)}`);
    return [];
  }
}

export function formatContextForPrompt(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) return '';
  return chunks
    .map((c, i) => `[Source ${i + 1}: ${c.source}]\n${c.text}`)
    .join('\n\n---\n\n');
}