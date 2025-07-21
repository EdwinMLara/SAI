import { Request, Response, NextFunction } from 'express';
import { UserInterface } from '@interfaces/User.interfaces';

import * as userService from '@services/User.services';
import * as userValidations from '@controllers/validations/User.validators';

import * as auth from '@utils/auth/crypt';
import responses from '@utils/responses';

export async function updateUser(
  req: Request<{}, {}, UserInterface>,
  res: Response,
  next: NextFunction
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
    next(error);
  }
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
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
    next(error);
  }
}
