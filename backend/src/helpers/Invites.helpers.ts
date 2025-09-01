import AppError from '@utils/system/AppError';
import responses from '@utils/system/responses';

import { hasInvite } from '@services/Invite.services';

/* ------------------ Code ------------------ */

/**
 * Validates that an email address is not already invited
 * @param email - Email address to check for existing invitations
 * @returns Promise<void>
 * @throws AppError if email is missing or already has an invitation
 */
export async function validateState(email: string): Promise<void> {
   const invited = await hasInvite(email);
   if (!invited) {
      throw new AppError(responses.User.dupliedInvite, 409);
   }
}
