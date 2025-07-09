import Invite from '@models/Invite.model';
import responses from '@utils/responses';
import logger from '@utils/logger';

interface Response {
  pass: boolean;
  message: string;
  error?: boolean;
}

export async function exists(email: string): Promise<Response> {
  try {
    const result = await Invite.findOne({ email });
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
    logger.error('An error occurred during exists check:', error);
    return {
      pass: false,
      message: responses.INTERNAL_SERVER_ERROR,
      error: true,
    };
  }
}
