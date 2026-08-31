import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { cameraRoutes } from './routes/camera.routes';
import { errorHandler } from './api/middlewares/errorHandler';
import { apiLimiter } from './api/middlewares/rateLimiter';
import { requireAppHeader } from './api/middlewares/csrfDefender';
import v1Router from './api/v1/routes';
import { cmsRoutes } from './routes/cms.routes';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate Limiting
app.use('/api', apiLimiter);

// API Routes
app.use('/api', requireAppHeader);
app.use('/api/v1', v1Router);
app.use('/api/v1/cameras', cameraRoutes);
app.use('/api/v1/cms', cmsRoutes);

// Centralized Error Handling
app.use(errorHandler);

export default app;
