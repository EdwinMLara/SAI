import { Invite } from '@interfaces/Invite.interfaces';
import InviteModel from '@models/Invite.model';
import responses from '@utils/responses';

export async function createInvite(
  invitedBy: string,
  email: string,
  role: 'admin' | 'user'
): Promise<{
  status: number;
  message: string;
}> {
  try {
    const invite = { invitedBy, email, role };
    const newInvite = new InviteModel(invite);
    await newInvite.save();
    let message = responses.INVITE_CREATED;
    if (role === 'admin') message = responses.INVITE_CREATED;
    if (role === 'user') message = responses.INVITE_CREATED;
    return {
      status: 201,
      message,
    };
  } catch (error) {
    return {
      status: 500,
      message: responses.INTERNAL_SERVER_ERROR,
    };
  }
}

export async function getInvites(user: string): Promise<{
  status: number;
  message: string;
  data?: string[];
}> {
  try {
    const results = await InviteModel.find({
      $or: [
        { invitedBy: { $regex: user, $options: 'i' } },
        { email: { $regex: user, $options: 'i' } },
      ],
    }).lean();
    const emails = results.map((invite: any) => invite.email).filter(Boolean);
    return {
      status: 200,
      message: responses.SUCCESS,
      data: emails,
    };
  } catch (error) {
    throw error;
  }
}

export async function removeInvite(
  email: string
): Promise<{ status: number; message: string }> {
  try {
    const deleted = await InviteModel.findOneAndDelete({ email });
    if (!deleted) {
      return {
        status: 404,
        message: responses.EMAIL_NOT_INVITED,
      };
    }
    return {
      status: 200,
      message: responses.INVITE_CREATED,
    };
  } catch (error) {
    throw error;
  }
}

export async function hasInvite(
  email: string
): Promise<{ exists: boolean; message: string }> {
  try {
    const found = await InviteModel.findOne({ email }).lean();
    if (found) {
      return { exists: true, message: responses.INVITE_ALREADY_EXISTS };
    }
    return { exists: false, message: responses.EMAIL_NOT_INVITED };
  } catch (error) {
    throw error;
  }
}
