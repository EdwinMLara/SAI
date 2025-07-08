import { Request, Response } from 'express';
import { UserInterface } from '@interfaces/User.interfaces';
import * as userService from '@services/User.services';
import * as userValidations from '@controllers/validations/User.validators';
import * as inviteService from '@services/Invite.services';
import * as auth from '@services/auth/crypt';
import logger from '@utils/logger';
import responses from '@utils/responses';

import {
  Login,
  CheckingToken,
  refreshToken as RefreshTokenService,
} from '@services/Auth.services';

export async function register(
  req: Request<{}, {}, UserInterface>,
  res: Response
): Promise<void> {
  try {
    const invite = await inviteService.hasInvite(req.body.email);
    if (!invite.exists) {
      res.status(403).json({ message: 'Email not invited' });
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
    logger.error('User registration failed', error);
    res.status(400).json({ message: responses.INVALID_DATA });
    return;
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    const result = await Login(email, password);
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
    logger.error('Error en login:', error);
    res.status(500).json({
      message: responses.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function verifyToken(req: Request, res: Response): Promise<void> {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      res.status(401).json({
        message: 'Token no proporcionado',
      });
      return;
    }
    const result = await CheckingToken(token);
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
    logger.error('Error en verificación de token:', error);
    res.status(500).json({
      message: responses.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function refreshToken(req: Request, res: Response): Promise<void> {
  try {
    const { refreshToken } = req.body;
    const result = await RefreshTokenService(refreshToken);
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
    logger.error('Error en refresh token:', error);
    res.status(500).json({
      message: responses.INTERNAL_SERVER_ERROR,
    });
  }
}
