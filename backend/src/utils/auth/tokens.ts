import jwt from 'jsonwebtoken';
import env from '@utils/env';

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

export function generateToken(payload: object): string {
  return jwt.sign(payload, jwtSecret, { expiresIn: '30d' });
}
