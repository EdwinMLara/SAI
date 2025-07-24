import { UserInfoAtToken } from '@types';

declare global {
  namespace Express {
    interface Request {
      user?: UserInfoAtToken;
    }
  }
}

export {};
