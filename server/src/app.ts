import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';
import { apiLimiter } from './middleware/rateLimit.middleware';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL.split(','), credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/api', apiLimiter);

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'PathForge AI' }));

app.use('/api/v1', routes);

app.use(errorHandler);

export default app;