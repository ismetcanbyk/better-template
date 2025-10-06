import "dotenv/config";
import { env } from "./env";
import app from "./app";
import { prisma } from "../prisma/client";

const PORT = env.PORT;

const server = app.listen(PORT, () => {
  console.log("🚀 Server is running");
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`📝 Auth API: http://localhost:${PORT}/api/auth/*`);
  console.log(`💚 Health: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${env.NODE_ENV}`);
});

const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received, closing server gracefully...`);

  server.close(async () => {
    console.log("✅ HTTP server closed");

    try {
      await prisma.$disconnect();
      console.log("✅ Database connection closed");
      process.exit(0);
    } catch (error) {
      console.error("❌ Error during shutdown:", error);
      process.exit(1);
    }
  });

  setTimeout(() => {
    console.error("⚠️ Forcing shutdown after timeout");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  gracefulShutdown("uncaughtException");
});
