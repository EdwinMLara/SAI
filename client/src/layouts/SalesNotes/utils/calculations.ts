import {
  SalesNoteProduct,
  SalesNoteProductType,
} from '@interfaces/SalesNote.interfaces';

import { round2 } from './format';

export const IVA_RATE = 0.16;

export const PRODUCT_TYPE_OPTIONS: ReadonlyArray<{
  value: SalesNoteProductType;
  label: string;
}> = [
  { value: 'resale', label: 'Producto de reventa' },
  { value: 'new', label: 'Producto nuevo' },
  { value: 'service', label: 'Servicio' },
];

export const PRODUCT_TYPE_LABELS: Record<SalesNoteProductType, string> = {
  resale: 'Reventa',
  new: 'Nuevo',
  service: 'Servicio',
};

export const getProductTypeLabel = (
  type?: SalesNoteProductType | null
): string => (type ? PRODUCT_TYPE_LABELS[type] ?? 'Producto' : 'Producto');

export const createEmptySalesNoteProduct = (): SalesNoteProduct => ({
  type: 'resale',
  description: '',
  quantity: 1,
  purchasePrice: 0,
  unitPrice: 0,
  subtotal: 0,
  iva: 0,
  total: 0,
});

export const calculateProduct = (
  product: SalesNoteProduct
): SalesNoteProduct => {
  const quantity = Number(product.quantity) || 0;
  const unitPrice = Number(product.unitPrice) || 0;
  const subtotal = round2(quantity * unitPrice);
  const iva = round2(subtotal * IVA_RATE);

  return {
    ...product,
    quantity,
    unitPrice,
    purchasePrice: Number(product.purchasePrice) || 0,
    subtotal,
    iva,
    total: round2(subtotal + iva),
  };
};

export interface SalesNoteCalculatedTotals {
  subtotal: number;
  iva: number;
  total: number;
}

export const calculateNoteTotals = (
  products: SalesNoteProduct[]
): SalesNoteCalculatedTotals => {
  const subtotal = round2(
    products.reduce((acc, product) => acc + (Number(product.subtotal) || 0), 0)
  );
  const iva = round2(
    products.reduce((acc, product) => acc + (Number(product.iva) || 0), 0)
  );

  return { subtotal, iva, total: round2(subtotal + iva) };
};
