import * as tokens from '@utils/auth/tokens';
import AppError from '@utils/AppError';
import responses from '@utils/responses/index.responses';

export function verifyToken(token: string): void {
  try {
    const isValid = tokens.verifyToken(token);
    if (!isValid) {
      throw new AppError('Token no accesible', 401);
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(responses.System.serverError, 500, error);
  }
}
