import { UsetInfoAtTokenType } from '@types';

declare global {
   namespace Express {
      interface Request {
         user: UsetInfoAtTokenType;
      }
   }
}
