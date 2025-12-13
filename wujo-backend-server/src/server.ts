import { createApp } from './app';
import { config } from './config/env';
import { connectDatabase, setupDatabaseEventHandlers, closeDatabaseConnection } from './config/database';

/**
 * Start the server
 */
const startServer = async (): Promise<void> => {
  try {
    // Setup database event handlers
    setupDatabaseEventHandlers();

    // Connect to MongoDB
    await connectDatabase();

    // Create Express app
    const app = createApp();

    // Start server
    const server = app.listen(config.server.port, () => {
      console.log(`[Server] Wujo Backend Server is running`);
      console.log(`[Server] Environment: ${config.server.nodeEnv}`);
      console.log(`[Server] Port: ${config.server.port}`);
      console.log(`[Server] Health check: http://localhost:${config.server.port}/health`);
    });

    // Graceful shutdown handlers
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n[Server] ${signal} received. Starting graceful shutdown...`);
      
      // Stop accepting new connections
      server.close(async () => {
        console.log('[Server] HTTP server closed');
        
        try {
          // Close database connections
          await closeDatabaseConnection();
          console.log('[Server] Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          console.error('[Server] Error during shutdown:', error);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('[Server] Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Handle termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('[Server] Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
