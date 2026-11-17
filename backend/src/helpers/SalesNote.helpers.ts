import * as services from '@services/SalesNote.services';

import {
  SalesNoteFiscalStamp,
  SalesNoteFiscalUpdate,
  SalesNoteInterface,
  SalesNoteProduct,
  SalesNoteProductType,
} from '@interfaces/SalesNote.interfaces';

import responses from '@responses';
import AppError from '@utils/AppError';

export async function comprobeInexistence(reference: string): Promise<void> {
  const exist = await services.existSalesNote(reference);
  if (exist) {
    throw new AppError(responses.SalesNote.alreadyExists, 409);
  }
}

export async function comprobeExistence(reference: string): Promise<void> {
  const exist = await services.existSalesNote(reference);
  if (!exist) {
    throw new AppError(responses.SalesNote.notFound, 404);
  }
}

export function getQuery(queryParam: unknown): string {
  const reference = queryParam as string;
  if (!reference) {
    throw new AppError(responses.SalesNote.requiredReference, 400);
  }
  return reference;
}

export const IVA_RATE = 0.16;

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function normalizeProductType(type: unknown): SalesNoteProductType {
  if (type === 'resale' || type === 'new' || type === 'service') {
    return type;
  }

  return 'resale';
}

export function normalizeTotals(products: SalesNoteProduct[]) {
  const normalized = products.map((product) => {
    const type = normalizeProductType(product.type);
    const quantity = Number(product.quantity) || 0;
    const unitPrice = Number(product.unitPrice) || 0;
    const purchasePrice =
      type === 'resale' ? Number(product.purchasePrice) || 0 : 0;
    const subtotal = round2(quantity * unitPrice);
    const iva = round2(subtotal * IVA_RATE);

    return {
      ...product,
      type,
      quantity,
      unitPrice,
      purchasePrice,
      subtotal,
      iva,
      total: round2(subtotal + iva),
    };
  });

  const subtotal = round2(
    normalized.reduce((acc, product) => acc + product.subtotal, 0)
  );
  const iva = round2(
    normalized.reduce((acc, product) => acc + product.iva, 0)
  );

  return { products: normalized, subtotal, iva, total: round2(subtotal + iva) };
}

export function validatePayload(body: SalesNoteInterface): void {
  if (!body.reference || !body.reference.trim()) {
    throw new AppError(responses.SalesNote.requiredReference, 400);
  }

  if (!body.customer || !body.customer.name?.trim()) {
    throw new AppError(responses.SalesNote.requiredCustomer, 400);
  }

  if (!Array.isArray(body.products) || body.products.length === 0) {
    throw new AppError(responses.SalesNote.requiredProducts, 400);
  }
}

function hasFiscalText(value?: string | null): boolean {
  return Boolean(value && value.trim());
}

export function hasAnyFiscalData(
  stamp?: Partial<SalesNoteFiscalStamp> | null
): boolean {
  return Boolean(
    stamp &&
      (hasFiscalText(stamp.satStamp) ||
        hasFiscalText(stamp.issuerStamp) ||
        hasFiscalText(stamp.originalString) ||
        stamp.stampedAt ||
        hasFiscalText(stamp.qrString))
  );
}

export function validateFiscalStampData(
  stamp?: Partial<SalesNoteFiscalStamp> | null
): void {
  if (
    !stamp ||
    !hasFiscalText(stamp.satStamp) ||
    !hasFiscalText(stamp.issuerStamp) ||
    !hasFiscalText(stamp.originalString) ||
    !stamp.stampedAt ||
    !hasFiscalText(stamp.qrString)
  ) {
    throw new AppError(responses.SalesNote.requiredFiscalStamp, 400);
  }

  const stampedAt = new Date(stamp.stampedAt);

  if (isNaN(stampedAt.getTime())) {
    throw new AppError(responses.SalesNote.invalidFiscalDate, 400);
  }
}

export function validateFiscalStamp(body: SalesNoteFiscalUpdate): void {
  validateFiscalStampData(body.fiscalStamp);
}
