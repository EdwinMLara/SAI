import SalesNoteModel from '@models/SalesNote.model';

import {
  PaginatedSalesNotesResponse,
  SalesNoteFiscalUpdate,
  SalesNoteInterface,
} from '@interfaces/SalesNote.interfaces';

import responses from '@responses';
import AppError from '@utils/AppError';

export async function createSalesNote(
  data: SalesNoteInterface
): Promise<SalesNoteInterface> {
  const newNote = new SalesNoteModel(data);
  await newNote.save();
  return newNote as SalesNoteInterface;
}

export async function getSalesNote(
  reference: string
): Promise<SalesNoteInterface> {
  const note = await SalesNoteModel.findOne({ reference });

  if (!note) {
    throw new AppError(responses.SalesNote.notFound, 404);
  }

  return note as SalesNoteInterface;
}

export async function getAllSalesNotes(
  page: number = 1,
  limit: number = 10
): Promise<PaginatedSalesNotesResponse> {
  const skip = (page - 1) * limit;

  const [notes, total] = await Promise.all([
    SalesNoteModel.find().sort({ date: -1 }).skip(skip).limit(limit),
    SalesNoteModel.countDocuments(),
  ]);

  return {
    notes: notes as SalesNoteInterface[],
    total,
    totalPages: Math.ceil(total / limit),
    page,
    limit,
  };
}

export async function updateSalesNote(
  reference: string,
  body: SalesNoteInterface
): Promise<SalesNoteInterface> {
  const cleanBody = { ...body } as Record<string, unknown>;

  delete cleanBody._id;
  delete cleanBody.__v;
  delete cleanBody.createdAt;
  delete cleanBody.updatedAt;
  delete cleanBody.reference;

  const note = await SalesNoteModel.findOneAndUpdate(
    { reference },
    { $set: cleanBody },
    { new: true, runValidators: true }
  );

  if (!note) {
    throw new AppError(responses.SalesNote.notFound, 404);
  }

  return note as SalesNoteInterface;
}

export async function updateFiscalStamp(
  reference: string,
  data: SalesNoteFiscalUpdate
): Promise<SalesNoteInterface> {
  const note = await SalesNoteModel.findOneAndUpdate(
    { reference },
    {
      $set: {
        'customer.rfc': data.rfc ?? null,
        fiscalStamp: {
          satStamp: data.fiscalStamp.satStamp,
          issuerStamp: data.fiscalStamp.issuerStamp,
          originalString: data.fiscalStamp.originalString,
          stampedAt: data.fiscalStamp.stampedAt,
          qrString: data.fiscalStamp.qrString,
        },
        status: 'stamped',
      },
    },
    { new: true, runValidators: true }
  );

  if (!note) {
    throw new AppError(responses.SalesNote.notFound, 404);
  }

  return note as SalesNoteInterface;
}

export async function deleteSalesNote(reference: string): Promise<void> {
  const result = await SalesNoteModel.deleteOne({ reference });

  if (result.deletedCount === 0) {
    throw new AppError(responses.SalesNote.notFound, 404);
  }
}

export async function existSalesNote(reference: string): Promise<boolean> {
  const note = await SalesNoteModel.findOne({ reference });
  return !!note;
}
