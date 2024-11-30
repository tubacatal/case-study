import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const validationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const resp = res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: errors.array(),
    });
    console.log(resp, typeof resp);
    return resp;
  }

  next();
};
