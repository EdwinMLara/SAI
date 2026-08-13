import { hasInvite } from '@services/Invite.services';

import responses from '@responses';
import AppError from '@utils/AppError';

/* ------------------ Code ------------------ */

export async function validateState(email: string): Promise<void> {
  try {
    if (!email) {
      throw new AppError(responses.System.missingFieldBody, 400);
    }

    const invited = await hasInvite(email);
    if (invited) {
      throw new AppError(responses.Invite.alreadyInvited, 409);
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(responses.System.serverError, 500, error);
  }
}

export async function validateExistence(email: string): Promise<void> {
  try {
    if (!email) {
      throw new AppError(responses.System.missingFieldBody, 400);
    }

    const invited = await hasInvite(email);
    if (!invited) {
      throw new AppError(responses.Invite.notFound, 404);
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(responses.System.serverError, 500, error);
  }
}
