import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

/**
 * Validation middleware for request body only
 * @deprecated Use `validate` instead for more flexibility
 */
export function validateRequest(schema: z.ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: formattedErrors,
        });
      }
      next(error);
    }
  };
}

/**
 * Flexible validation middleware
 * Validates different parts of the request (body, query, params)
 */
interface ValidationSchemas {
  body?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
}

export function validate(schemas: ValidationSchemas) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query) as any;
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as any;
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
          type: err.code,
        }));

        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: formattedErrors,
        });
      }
      next(error);
    }
  };
}
