import { exists } from '@controllers/validations/Invoice.validations';
import responses from '@utils/responses';

interface Response {
  pass: boolean;
  message: string;
  error?: boolean;
}

export async function integrity(
  query: string,
  transaction: string
): Promise<Response> {
  if (!query) {
    return {
      pass: false,
      message: responses.REQUIRED_INVOICE_ID,
      error: true,
    };
  }

  if (!transaction) {
    return {
      pass: false,
      message: responses.REQUIRED_INVOICE_ID,
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
      message: responses.INTERNAL_SERVER_ERROR,
      error: true,
    };
  }
}
