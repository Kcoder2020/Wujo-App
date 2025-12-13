import mongoose from 'mongoose';
import { config } from './env';

let connectionAttempts = 0;
const MAX_RETRY_ATTEMPTS = 5;
const INITIAL_RETRY_DELAY = 1000; // 1 second

/**
 * Connect to MongoDB with retry logic and exponential backoff
 */
export const connectDatabase = async (): Promise<void> => {
  const options: mongoose.ConnectOptions = {
    minPoolSize: config.mongodb.poolMin,
    maxPoolSize: config.mongodb.poolMax,
    serverSelectionTimeoutMS: 10000, // 10 second timeout for queries
    socketTimeoutMS: 45000,
  };

  const attemptConnection = async (): Promise<void> => {
    try {
      connectionAttempts++;
      console.log(`[Database] Attempting to connect to MongoDB (Attempt ${connectionAttempts}/${MAX_RETRY_ATTEMPTS})...`);
      
      await mongoose.connect(config.mongodb.uri, options);
      
      console.log('[Database] Successfully connected to MongoDB');
      connectionAttempts = 0; // Reset on successful connection
    } catch (error) {
      console.error('[Database] Connection failed:', error instanceof Error ? error.message : error);
      
      if (connectionAttempts >= MAX_RETRY_ATTEMPTS) {
        console.error('[Database] Maximum retry attempts reached. Exiting...');
        process.exit(1);
      }
      
      // Exponential backoff: 1s, 2s, 4s, 8s, 16s
      const retryDelay = INITIAL_RETRY_DELAY * Math.pow(2, connectionAttempts - 1);
      console.log(`[Database] Retrying in ${retryDelay / 1000} seconds...`);
      
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      await attemptConnection();
    }
  };

  await attemptConnection();
};

/**
 * Set up MongoDB connection event handlers
 */
export const setupDatabaseEventHandlers = (): void => {
  mongoose.connection.on('connected', () => {
    console.log('[Database] Mongoose connected to MongoDB');
  });

  mongoose.connection.on('error', (err) => {
    console.error('[Database] Mongoose connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[Database] Mongoose disconnected from MongoDB');
  });

  // Handle application termination
  process.on('SIGINT', async () => {
    await closeDatabaseConnection();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await closeDatabaseConnection();
    process.exit(0);
  });
};

/**
 * Close database connection gracefully
 */
export const closeDatabaseConnection = async (): Promise<void> => {
  try {
    console.log('[Database] Closing MongoDB connection...');
    await mongoose.connection.close();
    console.log('[Database] MongoDB connection closed successfully');
  } catch (error) {
    console.error('[Database] Error closing MongoDB connection:', error);
    throw error;
  }
};

/**
 * Check if database is connected
 */
export const isDatabaseConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};
