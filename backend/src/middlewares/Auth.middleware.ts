import { Request, Response, NextFunction } from 'express';
import * as authService from '@services/Auth.services';
import { decodeToken } from '@utils/auth/tokens';
import responses from '@utils/responses';

export interface AuthenticatedUser {
  email: string;
  role: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthenticatedUser;
  }
}

export type TokenValidator = {
  isValid(token: string): Promise<boolean>;
  decode(token: string): Promise<AuthenticatedUser | null>;
};

export const defaultTokenValidator: TokenValidator = {
  async isValid(token: string): Promise<boolean> {
    const result = await authService.CheckingToken(token);
    return result?.status === 200;
  },
  async decode(token: string): Promise<AuthenticatedUser | null> {
    return Promise.resolve(decodeToken(token));
  },
};

export const authenticateToken =
  (tokenValidator: TokenValidator = defaultTokenValidator) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        res.status(401).json({ message: responses.LOGIN_REQUIRED });
        return;
      }

      const valid = await tokenValidator.isValid(token);
      if (!valid) {
        res.status(401).json({ message: responses.LOGIN_REQUIRED });
        return;
      }

      const decoded = await tokenValidator.decode(token);
      if (!decoded) {
        res.status(401).json({ message: responses.LOGIN_REQUIRED });
        return;
      }

      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };

export const requireRole =
  (roles: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: responses.LOGIN_REQUIRED });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: responses.ACCESS_DENIED });
      return;
    }
    next();
  };

export const reqAdmin = requireRole(['admin']);
export const reqUser = requireRole(['user', 'admin']);
