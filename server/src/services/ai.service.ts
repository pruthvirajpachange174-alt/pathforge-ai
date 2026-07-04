import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { env } from '../config/env';

const anthropic = env.ANTHROPIC_API_KEY ? new Anthropic({ apiKey: env.ANTHROPIC_API_KEY }) : null;
const openai = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function generateChatCompletion(opts: {
  system: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
}): Promise<string> {
  const { system, messages, temperature = 0.7, maxTokens = 2048 } = opts;

  if (env.AI_PROVIDER === 'anthropic' && anthropic) {
    const response = await anthropic.messages.create({
      model: env.ANTHROPIC_MODEL,
      max_tokens: maxTokens,
      temperature,
      system,
      messages: messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    });
    const block = response.content[0];
    return block.type === 'text' ? block.text : '';
  }

  if (openai) {
    const response = await openai.chat.completions.create({
      model: env.OPENAI_MODEL,
      temperature,
      max_tokens: maxTokens,
      messages: [{ role: 'system', content: system }, ...messages],
    });
    return response.choices[0]?.message?.content ?? '';
  }

  throw new Error('No AI provider configured');
}

export async function* streamChatCompletion(opts: {
  system: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
}): AsyncGenerator<string> {
  const { system, messages, temperature = 0.7, maxTokens = 2048 } = opts;

  if (env.AI_PROVIDER === 'anthropic' && anthropic) {
    const stream = anthropic.messages.stream({
      model: env.ANTHROPIC_MODEL,
      max_tokens: maxTokens,
      temperature,
      system,
      messages: messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    });
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        yield event.delta.text;
      }
    }
    return;
  }

  if (openai) {
    const stream = await openai.chat.completions.create({
      model: env.OPENAI_MODEL,
      temperature,
      max_tokens: maxTokens,
      stream: true,
      messages: [{ role: 'system', content: system }, ...messages],
    });
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) yield delta;
    }
  }
}