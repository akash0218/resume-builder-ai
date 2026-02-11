import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../types";

/**
 * Middleware to validate API key from x-api-key header
 */
export function apiKeyAuth(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.headers["x-api-key"];
  const expectedKey = process.env.BACKEND_API_KEY;

  if (!apiKey || apiKey !== expectedKey) {
    const errorResponse: ErrorResponse = {
      error: {
        code: "UNAUTHORIZED",
        message: "Missing or invalid API key",
      },
    };
    res.status(401).json(errorResponse);
    return;
  }

  next();
}
