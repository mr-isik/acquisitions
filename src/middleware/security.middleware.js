import aj from '#config/arcjet.js';
import logger from '#config/logger.js';
import { slidingWindow } from '@arcjet/node';

const securityMiddleware = async (req, res, next) => {
  try {
    const role = req.user?.role || 'guest';

    let limit;

    switch (role) {
      case 'admin':
        limit = 20; // 20 requests per minute for admin
        break;
      case 'user':
        limit = 10; // 10 requests per minute for regular user
        break;
      case 'guest':
        limit = 5; // 5 requests per minute for guest
        break;
    }

    const client = aj.withRule(
      slidingWindow({
        mode: 'LIVE',
        interval: 2,
        max: limit,
        name: `${role}-rate-limit`,
      })
    );

    const decision = await client.protect(req);

    if (decision.isDenied() && decision.reason.isBot()) {
      logger.warn('Bot detected:', {
        ip: req.ip,
        path: req.path,
        userAgent: req.headers['user-agent'],
      });
      return res
        .status(403)
        .json({ error: 'Forbidden', message: 'Access denied: Bot detected' });
    }

    if (decision.isDenied() && decision.reason.isShield()) {
      logger.warn('Shield blocked request:', {
        ip: req.ip,
        path: req.path,
        userAgent: req.headers['user-agent'],
        method: req.method,
      });
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Request blocked by security policy',
      });
    }

    if (decision.isDenied() && decision.reason.isRateLimit()) {
      logger.warn('Rate limit exceeded:', {
        ip: req.ip,
        path: req.path,
        userAgent: req.headers['user-agent'],
      });
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Too many requests',
      });
    }

    next();
  } catch (error) {
    console.error('Security Middleware Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default securityMiddleware;
