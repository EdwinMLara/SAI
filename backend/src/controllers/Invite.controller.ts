import { Request, Response, NextFunction } from 'express';

import * as userServices from '@services/User.services';
import * as helpers from '@helpers/Invites.helpers';
import * as services from '@services/Invite.services';

import responses from '@utils/responses';
import AppError from '@utils/system/AppError';

/**
 * Creates a new invitation for a user to join the system
 * Validates auth token, email availability, and creates invite with specified role
 * @param req - Express request object containing auth token, email, and role in body
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns Promise<void>
 */
export async function createInvite(
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      const { auth, email, role } = req.body;

      await helpers.validateAuthToken(auth);
      await helpers.validateState(email);
      const ref = await helpers.getRef(auth);

      await services.createInvite(ref, email, role);
      res.status(201).json({
         message: responses.Invite.successfull,
      });
   } catch (error) {
      if (error instanceof AppError) {
         return next(error);
      }
      return next(new AppError(responses.System.serverError, 500, error));
   }
}

/**
 * Retrieves all invitations created by the authenticated user
 * Returns a list of pending invitations sent by the current user
 * @param req - Express request object containing user information
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns Promise<void>
 */
export async function getInvites(
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      const user = await userServices.getIdUser(req.user.email);
      const list = await services.getInvites(user);

      res.status(200).json({
         message: responses.System.ok,
         data: { invites: list.data },
      });
   } catch (error) {
      if (error instanceof AppError) {
         return next(error);
      }
      return next(new AppError(responses.System.serverError, 500, error));
   }
}

/**
 * Removes an existing invitation from the system
 * Validates that the invitation exists before deletion
 * @param req - Express request object containing email of invitation to remove in body
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns Promise<void>
 */
export async function removeInvite(
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      const { email } = req.body;
      if (!email) {
         throw new AppError(responses.System.missingFieldBody, 409);
      }

      await helpers.validateState(email);
      await services.removeInvite(email);

      res.status(200).json({
         message: responses.Invite.deleted,
      });
   } catch (error) {
      if (error instanceof AppError) {
         return next(error);
      }
      return next(new AppError(responses.System.serverError, 500, error));
   }
}
