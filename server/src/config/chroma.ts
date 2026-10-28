import { ChromaClient, type Collection, type IEmbeddingFunction } from 'chromadb';
import { env } from './env';

const client = new ChromaClient({ path: env.CHROMA_URL });

const externalEmbeddingFunction: IEmbeddingFunction = {
  async generate() {
    throw new Error('Generate embeddings with the configured embedding service.');
  },
};

let collectionPromise: Promise<Collection> | undefined;

export function getChromaCollection(): Promise<Collection> {
  if (!collectionPromise) {
    collectionPromise = client
      .getOrCreateCollection({
        name: env.CHROMA_COLLECTION,
        metadata: { 'hnsw:space': 'cosine' },
        embeddingFunction: externalEmbeddingFunction,
      })
      .catch((error: unknown) => {
        collectionPromise = undefined;
        throw error;
      });
  }

  return collectionPromise;
}
