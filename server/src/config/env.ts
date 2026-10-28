/** Configures Env for the backend. */
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  DATABASE_URL: z.string(),
  GEMINI_API_KEY: z.string().optional(),
GEMINI_MODEL: z.string().default("gemini-2.5-flash"),
  CLERK_SECRET_KEY: z.string(),
  CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_WEBHOOK_SECRET: z.string().optional(),
  ADMIN_EMAILS: z.string().default(''),
  AI_PROVIDER: z.enum(['anthropic', 'openai', 'gemini']).default('gemini'),
  ANTHROPIC_API_KEY: z.string().optional(),
  ANTHROPIC_MODEL: z.string().default('claude-3-5-sonnet-20241022'),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default('gpt-4o'),
  VECTOR_DB: z.enum(['pinecone', 'chroma']).default('pinecone'),
  PINECONE_API_KEY: z.string().optional(),
  PINECONE_INDEX: z.string().default('pathforge-index'),
  CHROMA_URL: z.string().default('http://localhost:8000'),
  CHROMA_COLLECTION: z.string().default('pathforge-ai'),
  EMBEDDING_MODEL: z.string().default('text-embedding-3-small'),
});

export const env = envSchema.parse(process.env);