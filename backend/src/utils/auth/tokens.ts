import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_Secret;

export function decodeToken(token: string): any | null {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
}

export function verifyToken(tokenToVerify: string): boolean {
  if (!jwtSecret) {
    return false;
  }
  try {
    jwt.verify(tokenToVerify, jwtSecret);
    return true;
  } catch (error) {
    return false;
  }
}

export function generateToken(payload: object): string {
  if (!jwtSecret) {
    throw new Error('JWT secret is not defined');
  }
  return jwt.sign(payload, jwtSecret, { expiresIn: '30d' });
}
