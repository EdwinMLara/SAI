import { exists } from '@controllers/validations/Invoice.validations';

interface Response {
  pass: boolean;
  message: string;
  error?: boolean;
}

export async function integrity(query: string): Promise<Response> {
  if (!query) {
    return {
      pass: false,
      message: 'Invoice ID is missing in the query request',
      error: true,
    };
  }

  try {
    const invoice = await exists(query);

    return {
      pass: invoice.pass,
      message: invoice.message,
      error: invoice.error,
    };
  } catch (error) {
    console.error('An error occurred during integrity check:', error);

    return {
      pass: false,
      message:
        error instanceof Error ? error.message : 'An unknown error occurred',
      error: true,
    };
  }
}
