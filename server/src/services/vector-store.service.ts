import { IncludeEnum } from 'chromadb';
import { env } from '../config/env';
import { getChromaCollection } from '../config/chroma';
import { getIndex } from '../config/pinecone';

export interface VectorRecord {
  id: string;
  embedding: number[];
  text: string;
  metadata: Record<string, string>;
}

export interface VectorSearchResult {
  id: string;
  score: number;
  text: string;
  source: string;
  metadata?: Record<string, unknown>;
}

function getString(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value : fallback;
}

export async function upsertVectors(vectors: VectorRecord[]): Promise<void> {
  if (vectors.length === 0) return;

  if (env.VECTOR_DB === 'chroma') {
    const collection = await getChromaCollection();
    await collection.upsert({
      ids: vectors.map(({ id }) => id),
      embeddings: vectors.map(({ embedding }) => embedding),
      documents: vectors.map(({ text }) => text),
      metadatas: vectors.map(({ metadata }) => metadata),
    });
    return;
  }

  const index = getIndex();
  if (!index) {
    throw new Error('PINECONE_API_KEY is required when VECTOR_DB=pinecone.');
  }

  await index.upsert(
    vectors.map(({ id, embedding, text, metadata }) => ({
      id,
      values: embedding,
      metadata: { ...metadata, text },
    })),
  );
}

export async function queryVectors(
  embedding: number[],
  topK: number,
): Promise<VectorSearchResult[]> {
  if (env.VECTOR_DB === 'chroma') {
    const collection = await getChromaCollection();
    const result = await collection.query({
      queryEmbeddings: [embedding],
      nResults: topK,
      include: [IncludeEnum.Documents, IncludeEnum.Metadatas, IncludeEnum.Distances],
    });
    const ids = result.ids[0] ?? [];
    const documents = result.documents?.[0] ?? [];
    const metadatas = result.metadatas?.[0] ?? [];
    const distances = result.distances?.[0] ?? [];

    return ids.map((id, i) => {
      const metadata = metadatas[i] ?? undefined;
      return {
        id,
        score: distances[i] === undefined ? 0 : 1 - distances[i],
        text: documents[i] ?? '',
        source: getString(metadata?.source, 'unknown'),
        metadata: metadata ?? undefined,
      };
    });
  }

  const index = getIndex();
  if (!index) {
    throw new Error('PINECONE_API_KEY is required when VECTOR_DB=pinecone.');
  }

  const result = await index.query({
    vector: embedding,
    topK,
    includeMetadata: true,
  });

  return result.matches.map((match) => ({
    id: match.id,
    score: match.score ?? 0,
    text: getString(match.metadata?.text, ''),
    source: getString(match.metadata?.source, 'unknown'),
    metadata: match.metadata,
  }));
}
