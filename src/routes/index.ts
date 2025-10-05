import { Router } from "express";

const router = Router();

// Health check
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API info
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Better Template API",
    version: "1.0.0",
    endpoints: {
      auth: {
        signUp: "POST /api/auth/sign-up/email",
        signIn: "POST /api/auth/sign-in/email",
        signOut: "POST /api/auth/sign-out",
        session: "GET /api/auth/get-session",
      },
      users: "/api/users ",
      health: "/api/health",
    },
  });
});

export default router;
