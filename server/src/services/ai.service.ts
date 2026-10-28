/** Provides backend functionality for Ai Service. */
// import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';
import { env } from '../config/env';

// const anthropic = env.ANTHROPIC_API_KEY ? new Anthropic({ apiKey: env.ANTHROPIC_API_KEY }) : null;
const gemini = env.GEMINI_API_KEY? new GoogleGenAI({apiKey: env.GEMINI_API_KEY,}): null;
const openai = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;

function formatGeminiPrompt(system: string, messages: ChatMessage[]): string {
  return `${system}\n\n${messages
    .map((message) => `${message.role.toUpperCase()}:\n${message.content}`)
    .join('\n\n')}`;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function generateChatCompletion(opts: {
  system: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  responseFormat?: 'json';
}): Promise<string> {
  const { system, messages, temperature = 0.7, maxTokens = 2048, responseFormat } = opts;

  if (env.AI_PROVIDER === 'gemini' && gemini) {
    const response = await gemini.models.generateContent({
      model: env.GEMINI_MODEL,
      contents: formatGeminiPrompt(system, messages),
      config: {
        temperature,
        maxOutputTokens: maxTokens,
        ...(responseFormat === 'json' ? { responseMimeType: 'application/json' } : {}),
      },
    });

    return response.text ?? '';
  }

  if (openai) {
    const response = await openai.chat.completions.create({
      model: env.OPENAI_MODEL,
      temperature,
      max_tokens: maxTokens,
      ...(responseFormat === 'json' ? { response_format: { type: 'json_object' as const } } : {}),
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

  if (env.AI_PROVIDER === 'gemini' && gemini) {
    const stream = await gemini.models.generateContentStream({
      model: env.GEMINI_MODEL,
      contents: formatGeminiPrompt(system, messages),
      config: { temperature, maxOutputTokens: maxTokens },
    });

    for await (const chunk of stream) {
      if (chunk.text) yield chunk.text;
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
    return;
  }

  throw new Error('No AI provider configured for streaming');
}