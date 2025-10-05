import { prisma } from "../prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { env, isProduction } from "./config/validate-env";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: isProduction, // Enabled in production
  },
  session: {
    // TODO: Move to env
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  secret: env.AUTH_SECRET,
  trustedOrigins: env.ALLOWED_ORIGINS,
  socialProviders: {
    // TODO: Uncomment and configure as needed
    // google: {
    //   clientId: env.GOOGLE_CLIENT_ID!,
    //   clientSecret: env.GOOGLE_CLIENT_SECRET!,
    // },
    // github: {
    //   clientId: env.GITHUB_CLIENT_ID!,
    //   clientSecret: env.GITHUB_CLIENT_SECRET!,
    // },
  },
});
