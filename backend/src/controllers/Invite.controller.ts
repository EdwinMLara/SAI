import { Request, Response } from 'express';
import * as userValidations from '@controllers/validations/User.validators';
import { Invite } from '@interfaces/Invite.interfaces';
import * as inviteValidations from '../controllers/validations/Invite.validators';
import * as InviteService from '@services/Invite.services';
import logger from '@utils/logger';
import responses from '@utils/responses';

export async function createInvite(
  req: Request<{}, {}, Invite>,
  res: Response
): Promise<void> {
  try {
    const { invitedBy, email } = req.body;
    const existsUser = await userValidations.exists(email);
    const existsInvite = await inviteValidations.exists(email);
    if (existsUser.error || existsInvite.error) {
      res.status(400).json({ message: responses.INTERNAL_SERVER_ERROR });
      return;
    }
    if (existsUser.pass || existsInvite.pass) {
      res.status(409).json({ message: responses.EMAIL_ALREADY_EXISTS });
      return;
    }
    const result = await InviteService.createInvite(invitedBy, email);
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    logger.error('Invite creation failed', error);
    res.status(400).json({ message: responses.INVALID_DATA });
    return;
  }
}

export async function getInvites(req: Request, res: Response): Promise<void> {
  try {
    const { user } = req.query;
    const list = await InviteService.getInvites(user as string);
    if (!list.data) {
      res.status(list.status).json({ message: list.message });
      return;
    }
    res.status(list.status).json({
      message: list.message,
      data: {
        data: list.data,
      },
    });
  } catch (error) {
    logger.error('Get invites failed', error);
    res.status(400).json({ message: responses.INVALID_DATA });
    return;
  }
}

export async function removeInvite(req: Request, res: Response): Promise<void> {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: responses.INVALID_DATA });
      return;
    }
    const existsInvite = await inviteValidations.exists(email);
    if (existsInvite.error) {
      res.status(400).json({ message: responses.INTERNAL_SERVER_ERROR });
      return;
    }
    if (!existsInvite.pass) {
      res.status(404).json({ message: responses.NOT_FOUND });
      return;
    }
    const result = await InviteService.removeInvite(email);
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    logger.error('Remove invite failed', error);
    res.status(400).json({ message: responses.INVALID_DATA });
    return;
  }
}
