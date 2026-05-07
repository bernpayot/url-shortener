import type { ZodSchema } from "zod";
import type { Request, Response, NextFunction } from "express";
import { ValidationError } from "../utils/errors.js";

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(new ValidationError(JSON.stringify(result.error.flatten())));
    }

    req.body = result.data;
    next();
  };
}
