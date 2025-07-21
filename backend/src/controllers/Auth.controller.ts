import { Request, Response, NextFunction } from 'express';
import { UserInterface } from '@interfaces/User.interfaces';
import * as userService from '@services/User.services';
import * as userValidations from '@controllers/validations/User.validators';
import * as inviteService from '@services/Invite.services';
import * as authServices from '@services/Auth.services';
import * as auth from '@utils/auth/crypt';
import responses from '@utils/responses';

export async function register(
  req: Request<{}, {}, UserInterface>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const invite = await inviteService.hasInvite(req.body.email);
    if (!invite.exists) {
      res.status(403).json({ message: responses.EMAIL_NOT_INVITED });
      return;
    }
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
    next(error);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body;
    const result = await authServices.Login(email, password);
    if (result.status === 200) {
      res.status(200).json({
        message: result.message,
        data: result.data,
      });
    } else {
      res.status(result.status).json({
        message: result.message,
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      res.status(401).json({
        message: responses.TOKEN_NOT_PROVIDED,
      });
      return;
    }
    const result = await authServices.CheckingToken(token);
    if (result.status === 200) {
      res.status(200).json({
        message: result.message,
        data: result.data,
      });
    } else {
      res.status(result.status).json({
        message: result.message,
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { refreshToken } = req.body;
    const result = await authServices.RefreshToken(refreshToken);
    if (result.status === 200) {
      res.status(200).json({
        message: result.message,
        data: result.data,
      });
    } else {
      res.status(result.status).json({
        message: result.message,
      });
    }
  } catch (error) {
    next(error);
  }
}
