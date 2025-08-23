import jwt from 'jsonwebtoken';
import env from '@config/env';

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

export function generateAccessToken(payload: object): string {
   return jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
}

export function generateRefreshToken(payload: object): string {
   return jwt.sign(payload, jwtSecret, { expiresIn: '15d' });
}

export function generateToken(payload: object): string {
   return jwt.sign(payload, jwtSecret, { expiresIn: '30d' });
}

export function getPayload(token: string): any | null {
   try {
      return jwt.verify(token, jwtSecret);
   } catch (error) {
      return null;
   }
}
