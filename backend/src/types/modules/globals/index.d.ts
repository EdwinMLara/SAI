import { ObjectId } from 'mongoose';

import { UserInfoAtToken } from '@types';

/* ------------------ Code ------------------ */

declare global {
   namespace Express {
      interface Request {
         user: UserInfoAtToken;
      }
   }
}
