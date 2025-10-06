import express, { Application } from "express";

import routes from "./routes";

import { requestLogger } from "./middleware/request-logger";
import helmet from "helmet";
import { errorHandler } from "./middleware/error-handler";
import { apiRateLimit } from "./middleware/rate-limit";
import { devCors, prodCors } from "./middleware/cors";
import { env } from "./env";
import { auth } from "./auth";

const isProduction = env.NODE_ENV === "production";
import { toNodeHandler } from "better-auth/node";

const app: Application = express();

// Body parsers MUST come before routes
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));
app.use(isProduction ? prodCors : devCors);
app.use(requestLogger);
app.use(helmet());
app.use("/api", apiRateLimit);

app.all("/api/auth/{*any}", toNodeHandler(auth));

// Custom API Routes (non-auth endpoints)
app.use("/api", routes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
  });
});

app.use(errorHandler);

export default app;
