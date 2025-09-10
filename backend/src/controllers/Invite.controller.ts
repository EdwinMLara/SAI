import { Request, Response, NextFunction } from 'express';

import AppError from '@utils/system/AppError';
import responses from '@utils/system/responses';
import * as helpers from '@helpers/Invites.helpers';
import * as services from '@services/Invite.services';
import getParam from '@utils/system/getParam';

import { InviteInt, NewInviteInt } from '@cmm_interfaces/index';

/* ------------------ Code ------------------ */

/**
 * Creates a new invitation for a user to join the system
 * Validates auth token, email availability, and creates invite with specified role
 * @param req - Express request object containing auth token, email, and role in body
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns Promise<void>
 */
export async function createInvite(
   req: Request<unknown, unknown, NewInviteInt>,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      const { invitedEmail, asignedRole } = req.body;
      await helpers.validateState(invitedEmail);

      const invite: InviteInt = {
         senderId: req.user.id,
         invitedEmail: invitedEmail,
         asignedRole: asignedRole,
      };

      await services.createInvite(invite);
      res.status(201).json({
         message: responses.System.ok,
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
      const list = await services.getInvites(req.user.id);

      res.status(200).json({
         message: responses.System.ok,
         data: { invites: list },
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
      const email = getParam(req.query.email);

      try {
         await helpers.validateState(email);
      } catch (error) {
         if (error instanceof AppError) {
            throw new AppError(responses.Unk.unk);
         }
         throw error;
      }
      await services.removeInvite(email);

      res.status(200).json({
         message: responses.System.ok,
      });
   } catch (error) {
      if (error instanceof AppError) return next(error);
      return next(new AppError(responses.System.serverError, 500, error));
   }
}
