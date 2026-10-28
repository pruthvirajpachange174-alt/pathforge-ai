/** Applies Rate Limit Middleware middleware to API requests. */
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: 'Too many requests, please try again later.',
});

export const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: 'Slow down! Please wait before sending more messages.',
});