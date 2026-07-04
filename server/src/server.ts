import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 PathForge AI server running on port ${env.PORT}`);
  logger.info(`📚 Environment: ${env.NODE_ENV}`);
  logger.info(`🤖 AI Provider: ${env.AI_PROVIDER}`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Closing HTTP server.');
  server.close(() => process.exit(0));
});