import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    DATABASE_URL: z.string().min(1),
    PORT: z.coerce.number().default(3000),
    AUTH_SECRET: z.string().min(32),
    ALLOWED_ORIGINS: z.string().min(1),
    REDIS_URL: z.string().url(),
    LOG_LEVEL: z
      .enum(["error", "warn", "info", "http", "debug"])
      .default("info"),
    API_RATE_LIMIT_MAX: z.coerce.number().default(100),
    AUTH_RATE_LIMIT_MAX: z.coerce.number().default(5),
    SMTP_HOST: z
      .string()
      .optional()
      .describe("SMTP server host for sending emails"),

    SMTP_PORT: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined))
      .describe("SMTP server port"),

    SMTP_USER: z.string().optional().describe("SMTP username"),

    SMTP_PASS: z.string().optional().describe("SMTP password"),

    SMTP_FROM: z.string().optional().describe("Email sender address"),

    GOOGLE_CLIENT_ID: z.string().optional().describe("Google OAuth Client ID"),

    GOOGLE_CLIENT_SECRET: z
      .string()
      .optional()
      .describe("Google OAuth Client Secret"),

    GITHUB_CLIENT_ID: z.string().optional().describe("GitHub OAuth Client ID"),

    GITHUB_CLIENT_SECRET: z
      .string()
      .optional()
      .describe("GitHub OAuth Client Secret"),
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    PORT: process.env.PORT,
    AUTH_SECRET: process.env.AUTH_SECRET,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
    REDIS_URL: process.env.REDIS_URL,
    LOG_LEVEL: process.env.LOG_LEVEL,
    API_RATE_LIMIT_MAX: process.env.API_RATE_LIMIT_MAX,
    AUTH_RATE_LIMIT_MAX: process.env.AUTH_RATE_LIMIT_MAX,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_FROM: process.env.SMTP_FROM,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  },

  emptyStringAsUndefined: true,
});
