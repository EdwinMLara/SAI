import { ObjectId } from 'mongoose';

import { hasInvite } from '@services/Invite.services';
import { getIdUser } from '@services/User.services';

import * as token from '@auth/tokens';
import responses from '@utils/system/responses';
import AppError from '@utils/system/AppError';

/**
 * Validates authentication token for invite operations
 * @param authToken - JWT token to validate
 * @returns Promise<void>
 * @throws AppError if token is missing or invalid
 */
export async function validateAuthToken(authToken: string): Promise<void> {
   try {
      if (!authToken) {
         throw new AppError(responses.System.missingFieldBody, 400);
      }
      const valid = token.verifyToken(authToken);
      if (!valid) {
         throw new AppError(responses.System.invalidJwtToken, 409);
      }
   } catch (error) {
      if (error instanceof AppError) {
         throw error;
      }
      throw new AppError(responses.System.serverError, 500, error);
   }
}

/**
 * Extracts sender reference from authentication token
 * @param authToken - JWT token containing sender information
 * @returns Promise<ObjectId> - ObjectId of the user sending the invitation
 * @throws AppError if token payload is invalid or user not found
 */
export async function getRef(authToken: string): Promise<ObjectId> {
   try {
      const payload = token.getPayload(authToken);
      if (!payload || !payload.invitedby) {
         throw new AppError(responses.System.invalidJwtToken, 401);
      }

      const invite = await getIdUser(payload.invitedby);
      if (!invite) {
         throw new AppError(responses.Invite.denied, 403);
      }
      return payload.invitedby;
   } catch (error) {
      if (error instanceof AppError) {
         throw error;
      }
      throw new AppError(responses.System.serverError, 500, error);
   }
}

/**
 * Validates that an email address is not already invited
 * @param email - Email address to check for existing invitations
 * @returns Promise<void>
 * @throws AppError if email is missing or already has an invitation
 */
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
