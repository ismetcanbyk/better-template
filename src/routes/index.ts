import { Router } from "express";
import userRoutes from "./user.routes";

const router = Router();

router.use("/users", userRoutes);

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
      users: {
        getAll: "GET /api/users",
        search: "GET /api/users/search?q=query",
        getMe: "GET /api/users/me",
        getById: "GET /api/users/:id",
        update: "PUT /api/users/:id",
        delete: "DELETE /api/users/:id",
        stats: "GET /api/users/stats",
      },
      health: "GET /api/health",
    },
  });
});

export default router;
