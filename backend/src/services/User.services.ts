import UserModel from '@models/User.model';
import { UserInterface } from '@interfaces/User.interfaces';
import responses from '@utils/responses';
import AppError from '@utils/AppError';

export async function createUser(user: UserInterface): Promise<{
  status: number;
  message: string;
}> {
  try {
    const newUser = new UserModel(user);
    await newUser.save();
    return {
      status: 201,
      message: responses.USER_CREATED,
    };
  } catch (error) {
    throw error;
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
      throw new AppError('Error en la transacción de la base de datos');
    }
    return {
      status: 200,
      message: 'Operación exitosa',
      data: user,
    };
  } catch (error) {
    throw error;
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
    const updated = await UserModel.findOneAndUpdate({ email }, user);
    if (!updated) {
      throw new AppError('Error en la transacción de la base de datos');
    }
    return {
      status: 200,
      message: 'Usuario actualizado',
    };
  } catch (error) {
    throw error;
  }
}

export async function deleteUser(email: string): Promise<{
  status: number;
  message: string;
}> {
  try {
    const deleted = await UserModel.findOneAndDelete({ email });
    if (!deleted) {
      throw new AppError('Error en la transacción de la base de datos');
    }
    return {
      status: 200,
      message: 'Usuario eliminado',
    };
  } catch (error) {
    throw error;
  }
}
