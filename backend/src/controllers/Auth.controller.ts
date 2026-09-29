import { Request, Response, NextFunction } from 'express';
import * as tokens from '@auth/tokens';
import * as emailServices from '@services/Email.services';

import * as auth from '@auth/crypt';
import * as services from '@services/Auth.services';
import * as helpers from '@helpers/User.helpers';
import * as authHelpers from '@helpers/Auth.helpers';
import * as userServices from '@services/User.services';
import * as cookies from '@utils/cookies/manageCookies';

import { UserInterface } from '@interfaces/User.interfaces';

import responses from '@responses';
import AppError from '@utils/AppError';

/* ------------------ Code ------------------ */

export async function register(
  req: Request<{}, {}, UserInterface>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as UserInterface & { username?: string };
    body.email = body.email.trim().toLowerCase();
    body.userName = body.username ?? '';
    delete body.username;
    await helpers.comprobeUnicity(body);
    await helpers.comprobeInvite(body.email);
    body.password = await auth.encrypt(body.password);
    body.role = await helpers.findRole(body.email);
    await userServices.createUser(body);
    await cookies.setAuthToken(res, body);
    await cookies.setRefreshToken(res, body);

    res.status(200).json({
      message: responses.User.created,
      user: await helpers.returnUser(body),
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(responses.System.serverError, 500, error));
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { password } = req.body;
    const email = req.body.email?.trim().toLowerCase();
    if (!email || !password) {
      throw new AppError(responses.System.missingFieldBody, 400);
    }
    const user = await userServices.getUserByObject(
      await userServices.getIdUser(email)
    );
    await services.login(user, password);
    await cookies.setAuthToken(res, user);
    await cookies.setRefreshToken(res, user);

    res.status(200).json({ message: responses.System.ok });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(responses.System.serverError, 500, error));
  }
}

export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { refreshToken } = req.cookies;
    const { user, publicUser } = await services.refreshUserTokens(
      refreshToken,
      res
    );
    const returnUser = await helpers.returnUser(user);

    res.status(200).json({
      message: responses.System.ok,
      user: returnUser,
      isAuthenticated: true,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(responses.System.serverError, 500, error));
  }
}

export async function logout(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    cookies.clearAuthCookies(res);

    res.status(200).json({ message: responses.System.ok });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(responses.System.serverError, 500, error));
  }
}

export async function sessionState(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tokenStatus = req.tokenStatus || {
      hasValidAccess: false,
      hasValidRefresh: false,
    };

    if (!req.user || !req.user.id) {
      res.status(200).json({
        message: responses.System.ok,
        isAuthenticated: false,
        user: null,
        access: tokenStatus.hasValidAccess,
        refresh: tokenStatus.hasValidRefresh,
      });
      return;
    }

    const user = await userServices.getUserById(req.user.id);
    const publicUser = await helpers.returnUser(user);
    res.status(200).json({
      message: responses.System.ok,
      isAuthenticated: true,
      user: publicUser,
      access: tokenStatus.hasValidAccess,
      refresh: tokenStatus.hasValidRefresh,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(responses.System.serverError, 500, error));
  }
}

export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const email = req.body.email?.trim().toLowerCase();
    if (!email) {
      throw new AppError(responses.System.missingFieldBody, 400);
    }
    const user = await userServices.getUserByObject(
      await userServices.getIdUser(email)
    );
    const resetToken = tokens.generateResetToken({
      id: user._id,
      email: user.email,
    });
    await emailServices.sendPasswordResetEmail(user.email, resetToken);
    res.status(200).json({ message: responses.User.resetSent });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(responses.System.serverError, 500, error));
  }
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      throw new AppError(responses.System.missingFieldBody, 400);
    }
    if (!authHelpers.verifyToken(token)) {
      throw new AppError(responses.User.invalidToken, 401);
    }
    const data = authHelpers.userData(token);
    if (!data || !data.id) {
      throw new AppError(responses.User.invalidToken, 401);
    }
    await userServices.getUserById(data.id);
    const hashedPassword = await auth.encrypt(newPassword);
    await userServices.updatedUser(data.id, { password: hashedPassword });
    cookies.clearAuthCookies(res);
    res.status(200).json({ message: responses.User.passwordChanged });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(responses.System.serverError, 500, error));
  }
}
