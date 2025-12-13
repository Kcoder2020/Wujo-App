import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { config } from './config/env';
import { requestLogger } from './middleware/logger.middleware';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { isDatabaseConnected } from './config/database';

// Import routes
import authRoutes from './routes/auth.routes';
import collectorRoutes from './routes/collector.routes';
import memberRoutes from './routes/member.routes';
import verificationRoutes from './routes/verification.routes';

/**
 * Create and configure Express application
 */
export const createApp = (): Application => {
  const app = express();

  // CORS configuration
  const corsOptions = {
    origin: config.cors.frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };

  // Middleware
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);

  // Health check endpoint
  app.get('/health', (req: Request, res: Response) => { 
    const dbConnected = isDatabaseConnected();
    
    res.json({
      status: dbConnected ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      mongodb: dbConnected ? 'connected' : 'disconnected',
    });
  });

  // API routes
  app.use('/api', authRoutes);
  app.use('/api', collectorRoutes);
  app.use('/api', memberRoutes);
  app.use('/api', verificationRoutes);

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
};
