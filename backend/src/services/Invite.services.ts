import { Invite } from '@interfaces/Invite.interfaces';
import InviteModel from '@models/Invite.model';
import responses from '@utils/responses';

export async function createInvite(
  invitedBy: string,
  email: string
): Promise<{
  status: number;
  message: string;
}> {
  try {
    const invite = { invitedBy, email };
    const newInvite = new InviteModel(invite);
    await newInvite.save();
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
    return {
      status: 500,
      message: responses.INTERNAL_SERVER_ERROR,
    };
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
        message: responses.NOT_FOUND,
      };
    }
    return {
      status: 200,
      message: responses.SUCCESS,
    };
  } catch (error) {
    return {
      status: 500,
      message: responses.INTERNAL_SERVER_ERROR,
    };
  }
}

export async function hasInvite(
  email: string
): Promise<{ exists: boolean; message: string }> {
  try {
    const found = await InviteModel.findOne({ email }).lean();
    if (found) {
      return { exists: true, message: responses.ALREADY_EXISTS };
    }
    return { exists: false, message: responses.NOT_FOUND };
  } catch (error) {
    return { exists: false, message: responses.INTERNAL_SERVER_ERROR };
  }
}
