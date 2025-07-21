import User from '@models/User.model';
import { encrypt, compareHash } from '../utils/auth/crypt';
import { generateToken, verifyToken, decodeToken } from '@utils/auth/tokens';
import { UserInterface } from '@interfaces/User.interfaces';
import responses from '@utils/responses';

export async function Login(
  email: string,
  password: string
): Promise<{
  status: number;
  message: string;
  data?: any;
}> {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return {
        status: 409,
        message: responses.INVALID_EMAIL,
      };
    }

    const isValidPassword = await compareHash(password, user.password);

    if (!isValidPassword) {
      return {
        status: 400,
        message: responses.INVALID_PASSWORD,
      };
    }

    const accessToken = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateToken({
      id: user._id,
      type: 'refresh',
    });

    const userData = {
      name: user.name,
      userName: user.userName,
      email: user.email,
      role: user.role,
      image: user.image,
    };

    return {
      status: 200,
      message: 'Login exitoso',
      data: {
        user: userData,
        accessToken,
        refreshToken,
      },
    };
  } catch (error) {
    throw error;
  }
}

export async function CheckingToken(token: string): Promise<{
  status: number;
  message: string;
  data?: any;
}> {
  try {
    const isValid = verifyToken(token);
    if (!isValid) {
      return {
        status: 401,
        message: responses.INVALID_TOKEN,
      };
    }

    const decoded = decodeToken(token);
    if (!decoded || !decoded.id) {
      return {
        status: 401,
        message: responses.INVALID_TOKEN,
      };
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return {
        status: 404,
        message: responses.USER_NOT_FOUND,
      };
    }

    const userData = {
      id: user._id,
      name: user.name,
      userName: user.userName,
      email: user.email,
      role: user.role,
      image: user.image,
    };

    return {
      status: 200,
      message: responses.VALID_TOKEN,
      data: { user: userData },
    };
  } catch (error) {
    throw error;
  }
}

export async function RefreshToken(refreshToken: string): Promise<{
  status: number;
  message: string;
  data?: any;
}> {
  try {
    const isValid = verifyToken(refreshToken);
    if (!isValid) {
      return {
        status: 401,
        message: responses.INVALID_REFRESH_TOKEN,
      };
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.decode(refreshToken);
    if (!decoded || !decoded.id || decoded.type !== 'refresh') {
      return {
        status: 401,
        message: responses.INVALID_REFRESH_TOKEN,
      };
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return {
        status: 404,
        message: responses.USER_NOT_FOUND,
      };
    }

    const newAccessToken = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    return {
      status: 200,
      message: responses.REFRESH_TOKEN_SUCCESS,
      data: { accessToken: newAccessToken },
    };
  } catch (error) {
    throw error;
  }
}
