import { Response } from "express";

export function errorHandler(err: Error, res: Response) {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
}
