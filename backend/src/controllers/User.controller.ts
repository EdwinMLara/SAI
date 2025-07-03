import { Request, Response } from 'express';
import { UserInterface } from '@interfaces/User.interfaces';

import * as userService from '@services/User.services';
import * as userValidations from '@controllers/validations/User.validators';

import * as auth from '@services/auth/crypt';
import logger from '@utils/logger';
import responses from '@utils/responses';

export async function createUser(
  req: Request<{}, {}, UserInterface>,
  res: Response
): Promise<void> {
  try {
    const exists = await userValidations.exists(req.body.email);

    if (exists.error) {
      res.status(400).json({ message: exists.message });
      return;
    }

    if (exists.pass) {
      res.status(409).json({ message: responses.EMAIL_ALREADY_EXISTS });
      return;
    }

    req.body.password = await auth.encrypt(req.body.password);

    const result = await userService.createUser(req.body);
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    logger.error('User creation failed', error);
    res.status(400).json({ message: responses.INVALID_DATA });
    return;
  }
}

export async function readUser(req: Request, res: Response): Promise<void> {
  if (!req.query.email) {
    res.status(400).json({ message: responses.BAD_REQUEST });
    return;
  }
  try {
    const exists = await userValidations.exists(req.query.email as string);
    if (exists.error) {
      res.status(500).json({ message: responses.INTERNAL_SERVER_ERROR });
      return;
    }
    if (!exists.pass) {
      res.status(404).json({ message: responses.USER_NOT_FOUND });
      return;
    }
    const user = await userService.readUser(req.query.email as string);
    res.status(user.status).json({ message: user.message, user: user.data });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: responses.INTERNAL_SERVER_ERROR });
  }
}

export async function updateUser(
  req: Request<{}, {}, UserInterface>,
  res: Response
): Promise<void> {
  try {
    const exists = await userValidations.exists(req.body.email);
    if (exists.error) {
      res.status(500).json({ message: responses.INTERNAL_SERVER_ERROR });
      return;
    }
    if (!exists.pass) {
      res.status(404).json({ message: responses.USER_NOT_FOUND });
      return;
    }
    if (req.body.password) {
      req.body.password = await auth.encrypt(req.body.password);
    }
    const result = await userService.updateUser(req.body, req.body.email);
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: responses.INTERNAL_SERVER_ERROR });
  }
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  if (!req.query.email) {
    res.status(400).json({ message: responses.BAD_REQUEST });
    return;
  }
  try {
    const exists = await userValidations.exists(req.query.email as string);
    if (exists.error) {
      res.status(500).json({ message: responses.INTERNAL_SERVER_ERROR });
      return;
    }
    if (!exists.pass) {
      res.status(404).json({ message: responses.USER_NOT_FOUND });
      return;
    }
    const result = await userService.deleteUser(req.query.email as string);
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: responses.INTERNAL_SERVER_ERROR });
  }
}
