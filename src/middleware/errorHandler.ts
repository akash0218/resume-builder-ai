import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../types";
import { ZodError } from "zod";

/**
 * Global error handler middleware
 */
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error("Error:", err);

  // Zod validation error
  if (err instanceof ZodError) {
    const errorResponse: ErrorResponse = {
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed",
        details: err.errors,
      },
    };
    res.status(400).json(errorResponse);
    return;
  }

  // Custom app errors
  if (err.code && err.message) {
    res.status(err.status || 500).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    } as ErrorResponse);
    return;
  }

  // Generic error
  const errorResponse: ErrorResponse = {
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: err.message || "An unexpected error occurred",
    },
  };

  res.status(500).json(errorResponse);
}
