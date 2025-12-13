import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Environment configuration interface
 */
export interface EnvironmentConfig {
  server: {
    port: number;
    nodeEnv: string;
  };
  mongodb: {
    uri: string;
    poolMin: number;
    poolMax: number;
  };
  jwt: {
    secret: string;
    expiration: string;
  };
  cors: {
    frontendUrl: string;
  };
  logging: {
    level: string;
  };
}

/**
 * Validate required environment variables
 */
const validateEnv = (): void => {
  const required = ['MONGODB_URI', 'JWT_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Validate JWT_SECRET length (should be at least 32 characters for security)
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn('[Config] WARNING: JWT_SECRET should be at least 32 characters for security');
  }
};

// Validate environment variables on load
validateEnv();

/**
 * Typed configuration object
 */
export const config: EnvironmentConfig = {
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  mongodb: {
    uri: process.env.MONGODB_URI!,
    poolMin: parseInt(process.env.MONGODB_POOL_MIN || '5', 10),
    poolMax: parseInt(process.env.MONGODB_POOL_MAX || '20', 10),
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiration: process.env.JWT_EXPIRATION || '30d',
  },
  cors: {
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:8080',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

// Log configuration in development mode (excluding sensitive data)
if (config.server.nodeEnv === 'development') {
  console.log('[Config] Environment configuration loaded:');
  console.log(`  - Node Environment: ${config.server.nodeEnv}`);
  console.log(`  - Server Port: ${config.server.port}`);
  console.log(`  - MongoDB URI: ${config.mongodb.uri.replace(/\/\/.*@/, '//***:***@')}`); // Hide credentials
  console.log(`  - MongoDB Pool: ${config.mongodb.poolMin}-${config.mongodb.poolMax}`);
  console.log(`  - JWT Expiration: ${config.jwt.expiration}`);
  console.log(`  - Frontend URL: ${config.cors.frontendUrl}`);
  console.log(`  - Log Level: ${config.logging.level}`);
}
