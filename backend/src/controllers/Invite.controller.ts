import { Request, Response, NextFunction } from 'express';

import { getIdUser } from '@services/User.services';
import * as helpers from '@helpers/Invites.helpers';
import * as services from '@services/Invite.services';

import responses from '@responses';
import AppError from '@utils/AppError';

/* ------------------ Code ------------------ */

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

export async function getInvites(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await getIdUser(req.user.email);
    const list = await services.getInvites(user);

    res.status(200).json({
      message: responses.System.ok,
      invites: list.data,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(responses.System.serverError, 500, error));
  }
}

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
