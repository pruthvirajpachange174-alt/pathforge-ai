/** Provides backend utilities for Async Handler. */
import { Request, Response, NextFunction } from 'express';

export const asyncHandler = (fn: any) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);