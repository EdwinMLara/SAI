import jwt from 'jsonwebtoken';
import env from '@config/env';
import { UserInfoAtToken } from '@types';

/* ------------------ Code ------------------ */

const jwtSecret = env.JWT_SECRET;

export function decodeToken(token: string): any | null {
   try {
      return jwt.decode(token);
   } catch (error) {
      return null;
   }
}

export function verifyToken(tokenToVerify: string): boolean {
   try {
      jwt.verify(tokenToVerify, jwtSecret);
      return true;
   } catch (error) {
      return false;
   }
}

export function createToken(infoToken: any, ageToken: number): string {
   return jwt.sign(infoToken, jwtSecret, { expiresIn: ageToken });
}
