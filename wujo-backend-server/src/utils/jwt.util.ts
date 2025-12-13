import jwt from 'jsonwebtoken';
import { config } from '../config/env';

/**
 * JWT Payload interface
 */
export interface JWTPayload {
  userId: string;
  role: 'collector' | 'member';
  iat?: number;
  exp?: number;
}

/**
 * Generate a JWT token for a user
 * @param userId - User's unique identifier
 * @param role - User's role (collector or member)
 * @returns JWT token string
 */
export const generateToken = (userId: string, role: 'collector' | 'member'): string => {
  try {
    const payload: JWTPayload = {
      userId,
      role,
    };

    const token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiration,
    });

    return token;
  } catch (error) {
    console.error('[JWT] Error generating token:', error);
    throw new Error('Failed to generate token');
  }
};

/**
 * Verify and decode a JWT token
 * @param token - JWT token string
 * @returns Decoded JWT payload
 * @throws Error if token is invalid or expired
 */
export const verifyToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    } else {
      console.error('[JWT] Error verifying token:', error);
      throw new Error('Token verification failed');
    }
  }
};

/**
 * Decode a JWT token without verification (for debugging)
 * @param token - JWT token string
 * @returns Decoded JWT payload or null
 */
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('[JWT] Error decoding token:', error);
    return null;
  }
};
