import InvoiceModel from '../../models/Invoice.model';

export async function exists(id: string): Promise<{
  pass: boolean;
  error?: boolean;
}> {
  try {
    const result = await InvoiceModel.findOne({ id });
    return { pass: !!result };
  } catch {
    return {
      pass: false,
      error: true,
    };
  }
}
