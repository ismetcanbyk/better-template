import { z } from "zod";

const envSchema = z.object({
  // ==================== SERVER ====================
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z
    .string()
    .default("3000")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0 && val < 65536, {
      message: "Port must be between 1 and 65535",
    }),

  // ==================== DATABASE ====================
  DATABASE_URL: z
    .string({ message: "DATABASE_URL is required" })
    .min(1, "DATABASE_URL is required")
    .startsWith("postgresql://", "Only PostgreSQL is supported"),

  // ==================== AUTH ====================
  AUTH_SECRET: z
    .string({ message: "AUTH_SECRET is required for Better Auth" })
    .min(32, "AUTH_SECRET must be at least 32 characters long for security")
    .describe("Secret key for Better Auth session encryption"),

  // ==================== CORS ====================
  ALLOWED_ORIGINS: z
    .string()
    .optional()
    .default("http://localhost:3000,http://localhost:5173")
    .transform((val) => val.split(",").map((origin) => origin.trim()))
    .describe("Comma-separated list of allowed CORS origins"),

  // ==================== RATE LIMITING ====================
  REDIS_URL: z
    .string()
    .optional()
    .describe("Redis URL for distributed rate limiting (optional)"),

  // ==================== SOCIAL AUTH (Optional) ====================
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

  // ==================== EMAIL (Optional - for email verification) ====================
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

  // ==================== OTHER ====================
  LOG_LEVEL: z
    .enum(["error", "warn", "info", "http", "debug"])
    .default("info")
    .describe("Logging level"),

  API_RATE_LIMIT_MAX: z
    .string()
    .default("100")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, "Rate limit must be positive")
    .describe("Maximum requests per minute for API endpoints"),

  AUTH_RATE_LIMIT_MAX: z
    .string()
    .default("5")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, "Rate limit must be positive")
    .describe("Maximum auth requests per 15 minutes"),
});

/**
 * Validate and parse environment variables
 * Throws an error with detailed information if validation fails
 */
function validateEnv() {
  try {
    const parsed = envSchema.safeParse(process.env);

    if (!parsed.success) {
      console.error("❌ Invalid environment variables:");
      console.error(JSON.stringify(parsed.error.format(), null, 2));
      throw new Error("Environment validation failed");
    }

    return parsed.data;
  } catch (error) {
    console.error("❌ Error validating environment variables:", error);
    process.exit(1);
  }
}

/**
 * Validated and type-safe environment variables
 * Import this instead of process.env for type safety
 *
 * @example
 * import { env } from './config/validate-env';
 * console.log(env.PORT); // number (type-safe!)
 * console.log(env.DATABASE_URL); // string
 */
export const env = validateEnv();

/**
 * Type of validated environment variables
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Check if we're in production environment
 */
export const isProduction = env.NODE_ENV === "production";

/**
 * Check if we're in development environment
 */
export const isDevelopment = env.NODE_ENV === "development";

/**
 * Check if we're in test environment
 */
export const isTest = env.NODE_ENV === "test";
