import { Request, Response, NextFunction } from 'express';
import { generateRequestId } from '../utils/response.util';

/**
 * Request logging middleware
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  // Generate and attach request ID
  const requestId = generateRequestId();
  req.headers['x-request-id'] = requestId;

  // Record start time
  const startTime = Date.now();

  // Log request
  console.log('[Request]', {
    requestId,
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    timestamp: new Date().toISOString(),
  });

  // Override res.json to log response
  const originalJson = res.json.bind(res);
  res.json = function (body: any) {
    const responseTime = Date.now() - startTime;
    
    console.log('[Response]', {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    });

    return originalJson(body);
  };

  next();
};
