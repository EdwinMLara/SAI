import InvoiceModel from '../../models/Invoice.model';

interface Response {
  pass: boolean;
  message: string;
  error?: boolean;
}

export async function exists(id: string): Promise<Response> {
  try {
    const result = await InvoiceModel.findOne({ id });

    return {
      pass: !!result,
      message: result ? 'Invoice exists' : 'Invoice not found',
    };
  } catch (error) {
    console.error(`Error checking invoice ${id}:`, error);

    return {
      pass: false,
      message:
        error instanceof Error ? error.message : 'An unknown error occurred',
      error: true,
    };
  }
}
