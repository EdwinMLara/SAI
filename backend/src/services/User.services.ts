import { UserInterface } from '@interfaces/User.interfaces';
import UserModel from '@models/User.model';
import responses from '@utils/responses';

export async function createUser(user: UserInterface): Promise<{
  status: number;
  message: string;
}> {
  try {
    const newUser = new UserModel(user);
    await newUser.save();
    return {
      status: 201,
      message: responses.CREATED,
    };
  } catch (error) {
    return {
      status: 500,
      message: responses.INTERNAL_SERVER_ERROR,
    };
  }
}

export async function readUser(email: string): Promise<{
  status: number;
  message: string;
  data?: UserInterface | null;
}> {
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return {
        status: 404,
        message: responses.NOT_FOUND,
      };
    }
    return {
      status: 200,
      message: responses.RETRIEVED,
      data: user,
    };
  } catch (error) {
    return {
      status: 500,
      message: responses.INTERNAL_SERVER_ERROR,
    };
  }
}

export async function updateUser(
  user: UserInterface,
  email: string
): Promise<{
  status: number;
  message: string;
}> {
  try {
    const updated = await UserModel.findOneAndUpdate({ email }, user, {
      new: true,
    });
    if (!updated) {
      return {
        status: 404,
        message: responses.DOES_NOT_EXIST,
      };
    }
    return {
      status: 200,
      message: responses.UPDATED,
    };
  } catch (error) {
    return {
      status: 500,
      message: responses.INTERNAL_SERVER_ERROR,
    };
  }
}

export async function deleteUser(email: string): Promise<{
  status: number;
  message: string;
}> {
  try {
    const deleted = await UserModel.findOneAndDelete({ email });
    if (!deleted) {
      return {
        status: 404,
        message: responses.DOES_NOT_EXIST,
      };
    }
    return {
      status: 200,
      message: responses.DELETED,
    };
  } catch (error) {
    return {
      status: 500,
      message: responses.INTERNAL_SERVER_ERROR,
    };
  }
}
