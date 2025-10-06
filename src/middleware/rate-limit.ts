import rateLimit, { Options } from "express-rate-limit";
import { env } from "../env";

/**
 * Base rate limit configuration
 * For production with Redis: npm install rate-limit-redis ioredis
 */
const baseConfig: Partial<Options> = {
  standardHeaders: true, // RateLimit-* headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  message: {
    success: false,
    error: "Too many requests, please try again later",
  },
  // Redis store for production (multi-server setup):
  // store: new RedisStore({ client: redisClient, prefix: "rl:" })
};

/**
 * Auth endpoints (login, signup) - Prevents brute force attacks
 * 5 requests per 15 minutes
 */
export const authRateLimit = rateLimit({
  ...baseConfig,
  windowMs: 15 * 60 * 1000,
  max: env.AUTH_RATE_LIMIT_MAX,
  message: {
    success: false,
    error: "Too many login attempts, try again later",
  },
});

/**
 * General API endpoints - Prevents abuse
 * 100 requests per minute (configurable)
 */
export const apiRateLimit = rateLimit({
  ...baseConfig,
  windowMs: 60 * 1000,
  max: env.API_RATE_LIMIT_MAX,
  skip: (req) => req.path === "/health", // Skip health checks
});

/**
 * Sensitive operations (password reset, email verification)
 * 10 requests per minute
 */
export const strictRateLimit = rateLimit({
  ...baseConfig,
  windowMs: 60 * 1000,
  max: 10,
  message: { success: false, error: "Too many requests, slow down" },
});
