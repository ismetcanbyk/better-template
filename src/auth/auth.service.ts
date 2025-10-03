import { betterAuth } from "better-auth";
import { prisma } from "../prisma/client";

export const auth = betterAuth({
  database: prisma,
  secret: process.env.BETTER_AUTH_SECRET || "super-secret-key",
  emailAndPassword: {
    enabled: true,
  },
});
