import { getIndex } from '../config/pinecone';
import { generateEmbedding } from './embedding.service';
import { logger } from '../utils/logger';

export interface RetrievedChunk {
  id: string;
  score: number;
  text: string;
  source: string;
  metadata?: Record<string, any>;
}

export async function retrieveContext(query: string, topK = 5): Promise<RetrievedChunk[]> {
  const index = getIndex();
  if (!index) {
    logger.warn('Pinecone not configured, skipping retrieval');
    return [];
  }
  try {
    const embedding = await generateEmbedding(query);
    const result = await index.query({
      vector: embedding,
      topK,
      includeMetadata: true,
    });
    return result.matches.map((m) => ({
      id: m.id,
      score: m.score ?? 0,
      text: (m.metadata?.text as string) ?? '',
      source: (m.metadata?.source as string) ?? 'unknown',
      metadata: m.metadata,
    }));
  } catch (err: any) {
    logger.error(`RAG retrieval failed: ${err.message}`);
    return [];
  }
}

export function formatContextForPrompt(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) return '';
  return chunks
    .map((c, i) => `[Source ${i + 1}: ${c.source}]\n${c.text}`)
    .join('\n\n---\n\n');
}