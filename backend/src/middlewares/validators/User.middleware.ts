import { Request, Response, NextFunction } from 'express';
import UserValidator from '@validators/User.validator';
import responses from '@utils/responses';
import { ZodError } from 'zod';

export const validateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    req.body = await UserValidator.parseAsync(req.body);
    next();
  } catch (error) {
    if (
      error instanceof ZodError ||
      (error as { name?: string })?.name === 'ZodError'
    ) {
      res.status(400).json({
        message: responses.INTERFACE_VALUE_ERROR,
        errors: error instanceof ZodError ? error.errors : error,
      });
      return;
    }
    res.status(500).json({
      message: responses.INTERNAL_SERVER_ERROR,
    });
    return;
  }
};
