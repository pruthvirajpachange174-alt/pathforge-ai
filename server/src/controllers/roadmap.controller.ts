/** Handles API requests for Roadmap Controller. */
import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { generateChatCompletion } from '../services/ai.service';
import { buildRoadmapPrompt } from '../prompts/roadmap.prompt';
import { getUserProfile } from '../services/memory.service';
import { z } from 'zod';
import { logger } from '../utils/logger';

const roadmapSchema = z.object({
  title: z.string().min(1),
  goal: z.string().optional(),
  summary: z.string().default(''),
  semesters: z.array(z.object({
    semester: z.string().min(1),
    focus: z.string().default(''),
    skills: z.array(z.string()).default([]),
    projects: z.array(z.string()).default([]),
    languages: z.array(z.string()).default([]),
    activities: z.array(z.string()).default([]),
    resources: z.array(z.object({
      name: z.string(),
      url: z.string().default(''),
    })).default([]),
  })).min(1),
  milestones: z.array(z.object({
    month: z.string(),
    target: z.string(),
  })).default([]),
  placementPrep: z.object({
    month: z.string().default(''),
    topics: z.array(z.string()).default([]),
  }).optional(),
  finalAdvice: z.string().default(''),
});

function parseRoadmapResponse(raw: string) {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  const candidate = fenced?.[1] ?? trimmed;
  const firstBrace = candidate.indexOf('{');
  const lastBrace = candidate.lastIndexOf('}');
  if (firstBrace < 0 || lastBrace <= firstBrace) {
    throw new Error('The AI response did not contain a JSON roadmap.');
  }

  const parsed: unknown = JSON.parse(candidate.slice(firstBrace, lastBrace + 1));
  return roadmapSchema.parse(parsed);
}

export const generateRoadmap = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { goal } = req.body;
  if (typeof goal !== 'string' || !goal.trim()) {
    return res.status(400).json({ message: 'Please enter a goal for your roadmap.' });
  }
  if (goal.length > 500) {
    return res.status(400).json({ message: 'Your goal must be 500 characters or fewer.' });
  }

  const profile = req.userId ? await getUserProfile(req.userId) : {};
  const prompt = buildRoadmapPrompt(profile, goal.trim());

  let content: z.infer<typeof roadmapSchema> | undefined;
  const system = 'You are a JSON-only career roadmap generator. Output ONLY valid JSON.';
  const attempts = [
    prompt,
    `${prompt}\n\nYour previous response was invalid. Return a shorter complete JSON object now: use exactly 4 semesters, at most 2 items in each array, and concise strings. Ensure the JSON is syntactically valid and matches the schema.`,
  ];

  for (const [index, attemptPrompt] of attempts.entries()) {
    const raw = await generateChatCompletion({
      system,
      messages: [{ role: 'user', content: attemptPrompt }],
      temperature: index === 0 ? 0.4 : 0.2,
      maxTokens: 3500,
      responseFormat: 'json',
    });

    try {
      content = parseRoadmapResponse(raw);
      break;
    } catch (error) {
      if (index === attempts.length - 1) {
        logger.error(`Roadmap response validation failed after retry: ${error instanceof Error ? error.message : String(error)}`);
      } else {
        logger.warn(`Roadmap response was invalid; retrying with a shorter format: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  if (!content) {
    return res.status(502).json({
      success: false,
      message: 'The AI could not create a complete roadmap this time. Please try again.',
    });
  }

  const roadmap = await prisma.roadmap.create({
    data: { userId: req.userId, title: content.title || goal.trim(), goal: goal.trim(), content },
  });
  res.json({ success: true, data: roadmap });
});

export const listRoadmaps = asyncHandler(async (req: AuthRequest, res: Response) => {
  const list = await prisma.roadmap.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: list });
});