import { UserInfoAtToken } from '@types';

interface TokenStatus {
   hasValidAccess: boolean;
   hasValidRefresh: boolean;
}

declare global {
   namespace Express {
      interface Request {
         user: UserInfoAtToken;
         tokenStatus?: TokenStatus;
      }
   }
}

export {};
