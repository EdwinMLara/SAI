import InvoiceModel from '@models/Invoice.model';

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

export async function transaction(
  id: string,
  transaction: string
): Promise<Response> {
  try {
    const result = await InvoiceModel.findOne({ id });

    if (!result) {
      return {
        pass: false,
        message: 'Invoice not found',
      };
    }

    const transactionExists = result.payments?.some(
      (payment) => payment.transaction === transaction
    );

    return {
      pass: !!transactionExists,
      message: transactionExists
        ? 'Transaction exists in the invoice'
        : 'Transaction not found in the invoice',
    };
  } catch (error) {
    console.error(
      `Error checking transaction ${transaction} in invoice ${id}:`,
      error
    );

    return {
      pass: false,
      message:
        error instanceof Error ? error.message : 'An unknown error occurred',
      error: true,
    };
  }
}
