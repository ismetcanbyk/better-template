import { Request, Response, NextFunction } from "express";
import { env } from "../env";

// CORS options
interface CorsOptions {
  allowedOrigins?: string[];
  allowedMethods?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}

// CORS middleware factory
export const cors = (options: CorsOptions = {}) => {
  const {
    allowedOrigins = ["http://localhost:3000", "http://localhost:5173"],
    allowedMethods = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders = ["Content-Type", "Authorization"],
    exposedHeaders = ["X-RateLimit-Limit", "X-RateLimit-Remaining"],
    credentials = true,
    maxAge = 86400, // 24 hours
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;

    // Check if origin is allowed
    if (
      origin &&
      (allowedOrigins.includes("*") || allowedOrigins.includes(origin))
    ) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }

    // Set credentials
    if (credentials) {
      res.setHeader("Access-Control-Allow-Credentials", "true");
    }

    // Set allowed methods
    res.setHeader("Access-Control-Allow-Methods", allowedMethods.join(", "));

    // Set allowed headers
    res.setHeader("Access-Control-Allow-Headers", allowedHeaders.join(", "));

    // Set exposed headers
    if (exposedHeaders.length > 0) {
      res.setHeader("Access-Control-Expose-Headers", exposedHeaders.join(", "));
    }

    // Set max age for preflight
    res.setHeader("Access-Control-Max-Age", maxAge.toString());

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }

    next();
  };
};

// Development CORS (allows all)
export const devCors = cors({
  allowedOrigins: ["*"],
  credentials: false,
});

// Production CORS (strict - uses env variables)
export const prodCors = cors({
  allowedOrigins: env.ALLOWED_ORIGINS.split(","),
  credentials: true,
});
