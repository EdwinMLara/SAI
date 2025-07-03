import UserModel from '@models/User.model';
import responses from '@utils/responses';
import * as auth from '@services/auth/crypt';
import logger from '@utils/logger';

interface Response {
  pass: boolean;
  message: string;
  error?: boolean;
}

export async function exists(email: string): Promise<Response> {
  try {
    const result = await UserModel.findOne({ email });
    if (result) {
      return {
        pass: true,
        message: responses.ALREADY_EXISTS,
      };
    }
    return {
      pass: false,
      message: responses.NOT_FOUND,
    };
  } catch (error) {
    logger.error(`Error checking user existence for ${email}:`, error);
    return {
      pass: false,
      message: responses.INTERNAL_SERVER_ERROR,
      error: true,
    };
  }
}

export async function validatePassword(
  email: string,
  password: string
): Promise<Response> {
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return {
        pass: false,
        message: responses.NOT_FOUND,
      };
    }
    const result = await auth.compareHash(password as string, user.password);
    return {
      pass: result,
      message: result ? responses.PASSWORD_VALID : responses.INVALID_PASSWORD,
    };
  } catch (error) {
    logger.error(`Error checking password`, error);
    return {
      pass: false,
      message: responses.INTERNAL_SERVER_ERROR,
      error: true,
    };
  }
}
