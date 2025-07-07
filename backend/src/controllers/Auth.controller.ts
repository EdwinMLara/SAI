import { Request, Response } from 'express';
import {
  Login,
  CheckingToken,
  refreshToken as RefreshTokenService,
} from '@services/Auth.services';
import logger from '@utils/logger';
import responses from '@utils/responses';

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
