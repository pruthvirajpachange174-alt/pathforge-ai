import { Pinecone } from '@pinecone-database/pinecone';
import { env } from './env';

let pineconeClient: Pinecone | null = null;

export function getPinecone() {
  if (!env.PINECONE_API_KEY) return null;
  if (!pineconeClient) {
    pineconeClient = new Pinecone({ apiKey: env.PINECONE_API_KEY });
  }
  return pineconeClient;
}

export function getIndex() {
  const client = getPinecone();
  if (!client) return null;
  return client.index(env.PINECONE_INDEX);
}