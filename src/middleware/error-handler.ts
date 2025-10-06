import { Request, Response, NextFunction } from "express";
import { env } from "../env";

const isDevelopment = env.NODE_ENV === "development";

interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (isDevelopment) {
    console.error("❌ Error:", {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });

    return res.status(statusCode).json({
      success: false,
      error: message,
      stack: err.stack,
      path: req.path,
    });
  }

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Helper functions
export const notFound = (message = "Resource not found") => {
  return new ApiError(404, message);
};

export const unauthorized = (message = "Unauthorized") => {
  return new ApiError(401, message);
};

export const forbidden = (message = "Forbidden") => {
  return new ApiError(403, message);
};

export const badRequest = (message = "Bad request") => {
  return new ApiError(400, message);
};

export const conflict = (message = "Conflict") => {
  return new ApiError(409, message);
};
