import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { generateChatCompletion, streamChatCompletion } from '../services/ai.service';
import { retrieveContext, formatContextForPrompt } from '../services/rag.service';
import { getUserProfile, formatUserProfile } from '../services/memory.service';
import { buildSystemPrompt } from '../prompts/system.prompt';

export const listConversations = asyncHandler(async (req: AuthRequest, res: Response) => {
  const conversations = await prisma.conversation.findMany({
    where: { userId: req.userId },
    orderBy: { updatedAt: 'desc' },
    include: { messages: { take: 1, orderBy: { createdAt: 'desc' } } },
  });
  res.json({ success: true, data: conversations });
});

export const getConversation = asyncHandler(async (req: AuthRequest, res: Response) => {
  const conversation = await prisma.conversation.findFirst({
    where: { id: req.params.id, userId: req.userId },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  });
  if (!conversation) return res.status(404).json({ message: 'Not found' });
  res.json({ success: true, data: conversation });
});

export const createConversation = asyncHandler(async (req: AuthRequest, res: Response) => {
  const conversation = await prisma.conversation.create({
    data: { userId: req.userId!, title: req.body.title || 'New Chat' },
  });
  res.status(201).json({ success: true, data: conversation });
});

export const sendMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { conversationId, message } = req.body;
  if (!message?.trim()) return res.status(400).json({ message: 'Message required' });

  let convId = conversationId;
  if (!convId) {
    const conv = await prisma.conversation.create({
      data: { userId: req.userId!, title: message.slice(0, 40) },
    });
    convId = conv.id;
  }

  // Persist user message
  await prisma.message.create({
    data: { conversationId: convId, role: 'user', content: message },
  });

  // Retrieve context (RAG)
  const chunks = await retrieveContext(message, 5);
  const context = formatContextForPrompt(chunks);

  // User profile
  const profile = req.userId ? await getUserProfile(req.userId) : null;
  const userProfile = formatUserProfile(profile);

  // Recent messages
  const history = await prisma.message.findMany({
    where: { conversationId: convId },
    orderBy: { createdAt: 'asc' },
    take: 20,
  });

  const system = buildSystemPrompt(context, userProfile);
  const reply = await generateChatCompletion({
    system,
    messages: history.map((m) => ({ role: m.role as any, content: m.content })),
  });

  await prisma.message.create({
    data: { conversationId: convId, role: 'assistant', content: reply },
  });

  await prisma.conversation.update({
    where: { id: convId },
    data: { updatedAt: new Date() },
  });

  res.json({
    success: true,
    data: {
      conversationId: convId,
      reply,
      sources: chunks.map((c) => ({ source: c.source, score: c.score })),
    },
  });
});

export const streamMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { conversationId, message } = req.body;
  if (!message?.trim()) return res.status(400).json({ message: 'Message required' });

  let convId = conversationId;
  if (!convId) {
    const conv = await prisma.conversation.create({
      data: { userId: req.userId!, title: message.slice(0, 40) },
    });
    convId = conv.id;
  }

  await prisma.message.create({
    data: { conversationId: convId, role: 'user', content: message },
  });

  const chunks = await retrieveContext(message, 5);
  const context = formatContextForPrompt(chunks);
  const profile = req.userId ? await getUserProfile(req.userId) : null;
  const userProfile = formatUserProfile(profile);

  const history = await prisma.message.findMany({
    where: { conversationId: convId },
    orderBy: { createdAt: 'asc' },
    take: 20,
  });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.write(`event: meta\ndata: ${JSON.stringify({ conversationId: convId })}\n\n`);

  const system = buildSystemPrompt(context, userProfile);
  let full = '';
  for await (const chunk of streamChatCompletion({
    system,
    messages: history.map((m) => ({ role: m.role as any, content: m.content })),
  })) {
    full += chunk;
    res.write(`event: token\ndata: ${JSON.stringify({ text: chunk })}\n\n`);
  }

  await prisma.message.create({
    data: { conversationId: convId, role: 'assistant', content: full },
  });

  res.write(`event: done\ndata: {}\n\n`);
  res.end();
});

export const deleteConversation = asyncHandler(async (req: AuthRequest, res: Response) => {
  await prisma.conversation.deleteMany({
    where: { id: req.params.id, userId: req.userId },
  });
  res.json({ success: true });
});