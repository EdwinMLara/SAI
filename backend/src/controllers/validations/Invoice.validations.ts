import InvoiceModel from '@models/Invoice.model';
import responses from '@utils/responses';

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
      message: result ? responses.ALREADY_EXISTS : responses.NOT_FOUND,
    };
  } catch (error) {
    return {
      pass: false,
      message: responses.INTERNAL_SERVER_ERROR,
      error: true,
    };
  }
}

export async function transaction(
  id: string,
  transaction: string
): Promise<Response> {
  try {
    const result = await InvoiceModel.findOne({ id });

    if (!result) {
      return {
        pass: false,
        message: responses.NOT_FOUND,
      };
    }

    const transactionExists = result.payments?.some(
      (payment) => payment.transaction === transaction
    );

    return {
      pass: !!transactionExists,
      message: transactionExists ? responses.RETRIEVED : responses.NOT_FOUND,
    };
  } catch (error) {
    return {
      pass: false,
      message: responses.INTERNAL_SERVER_ERROR,
      error: true,
    };
  }
}
