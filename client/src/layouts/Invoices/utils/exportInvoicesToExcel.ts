import * as XLSX from 'xlsx-js-style';
import type {
  CellObject,
  ColInfo,
  Range,
  RowInfo,
  WorkSheet,
} from 'xlsx-js-style';

import { InvoiceInterface } from '@interfaces/Invoice.interfaces';

/* ------------------ Constantes ------------------ */

const COLUMN_COUNT = 6;

const COLOR = {
  brand700: '1D4ED8',
  brand600: '2563EB',
  slate50: 'F8FAFC',
  slate200: 'CBD5E1',
  slate800: '1E293B',
  white: 'FFFFFF',
  totalsBg: 'DCFCE7',
  totalsText: '15803D',
} as const;

const THIN_BORDER = { style: 'thin', color: { rgb: COLOR.slate200 } } as const;
const BORDER = {
  top: THIN_BORDER,
  left: THIN_BORDER,
  bottom: THIN_BORDER,
  right: THIN_BORDER,
};

const COLUMNS: ColInfo[] = [
  { wch: 14 }, // Fecha
  { wch: 45 }, // Concepto
  { wch: 18 }, // Referencia
  { wch: 16 }, // Total (con IVA)
  { wch: 16 }, // Total (sin IVA)
  { wch: 14 }, // IVA
];

type CellStyle = Record<string, unknown>;

type RowKind = 'title' | 'header' | 'data' | 'totals';

/* ------------------ Helpers ------------------ */

const getInvoiceIva = (invoice: InvoiceInterface): number =>
  (invoice.products || []).reduce(
    (acc, product) => acc + (Number(product.prices?.iva) || 0),
    0
  );

const round2 = (value: number): number => Math.round(value * 100) / 100;

/* En el catálogo CFDI del SAT, las claves que empiezan con 7, 8 o 9
   corresponden a servicios; el resto son bienes (productos). */
const isService = (claveProdServ: string): boolean =>
  /^[789]/.test(String(claveProdServ || '').trim());

/* Concepto según los conceptos de la factura:
   "Servicios de ..." solo si todos son servicios;
   "Venta de productos de ..." si al menos uno es producto. */
const getConcept = (invoice: InvoiceInterface): string => {
  const products = invoice.products || [];
  const emisor = invoice.emisorNombre ?? '';

  const allServices =
    products.length > 0 && products.every((product) => isService(product.claveProdServ));

  return allServices
    ? `Servicios de ${emisor}`.trim()
    : `Venta de productos de ${emisor}`.trim();
};

const formatDate = (date: Date): string => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

/* ------------------ Estilos ------------------ */

const titleStyle: CellStyle = {
  font: { bold: true, sz: 14, color: { rgb: COLOR.white } },
  fill: { patternType: 'solid', fgColor: { rgb: COLOR.brand700 } },
  alignment: { horizontal: 'left', vertical: 'center' },
};

const headerStyle: CellStyle = {
  font: { bold: true, sz: 11, color: { rgb: COLOR.white } },
  fill: { patternType: 'solid', fgColor: { rgb: COLOR.brand600 } },
  border: BORDER,
  alignment: { horizontal: 'center', vertical: 'center' },
};

const cellStyle = (zebra: boolean, numeric: boolean): CellStyle => ({
  font: { sz: 10, color: { rgb: COLOR.slate800 } },
  fill: {
    patternType: 'solid',
    fgColor: { rgb: zebra ? COLOR.slate50 : COLOR.white },
  },
  border: BORDER,
  alignment: {
    horizontal: numeric ? 'right' : 'left',
    vertical: 'center',
  },
});

const totalsStyle: CellStyle = {
  font: { bold: true, sz: 11, color: { rgb: COLOR.totalsText } },
  fill: { patternType: 'solid', fgColor: { rgb: COLOR.totalsBg } },
  border: BORDER,
  alignment: { horizontal: 'left', vertical: 'center' },
};

/* ------------------ Code ------------------ */

/* Genera y descarga un Excel simple con una fila por factura:
   Fecha, Concepto, Referencia, Total con IVA, Total sin IVA e IVA,
   más una fila final con los totales del mes. */
export const exportInvoicesToExcel = (
  invoices: InvoiceInterface[],
  monthLabel: string,
  monthKey: string
): void => {
  const aoa: (string | number)[][] = [];
  const kinds: (RowKind | undefined)[] = [];
  const merges: Range[] = [];
  const rowHeights: RowInfo[] = [];
  const moneyCells: string[] = [];

  const push = (row: (string | number)[], kind?: RowKind, height?: number) => {
    const rowIndex = aoa.length;
    aoa.push(row);
    kinds[rowIndex] = kind;
    if (height) rowHeights[rowIndex] = { hpt: height };
  };

  const monthlyTotals = { sinIva: 0, iva: 0, conIva: 0 };

  push([`Facturas de ${monthLabel}`], 'title', 26);
  merges.push({
    s: { r: 0, c: 0 },
    e: { r: 0, c: COLUMN_COUNT - 1 },
  });
  push([]);

  push(
    ['Fecha', 'Concepto', 'Referencia', 'Total (con IVA)', 'Total (sin IVA)', 'IVA'],
    'header',
    20
  );

  invoices.forEach((invoice, index) => {
    const iva = round2(getInvoiceIva(invoice));
    const conIva = round2(Number(invoice.total) || 0);
    const sinIva = round2(conIva - iva);

    monthlyTotals.sinIva += sinIva;
    monthlyTotals.iva += iva;
    monthlyTotals.conIva += conIva;

    const rowIndex = aoa.length;

    push(
      [
        formatDate(invoice.date),
        getConcept(invoice),
        invoice.reference ?? '',
        conIva,
        sinIva,
        iva,
      ],
      'data',
      18
    );

    for (let c = 3; c < COLUMN_COUNT; c += 1) {
      moneyCells.push(XLSX.utils.encode_cell({ r: rowIndex, c }));
    }
  });

  push([]);
  push([`Totales de ${monthLabel}`], 'title', 22);
  merges.push({
    s: { r: aoa.length - 1, c: 0 },
    e: { r: aoa.length - 1, c: COLUMN_COUNT - 1 },
  });
  const totalsRowIndex = aoa.length;
  push(
    [
      '',
      '',
      'Total',
      round2(monthlyTotals.conIva),
      round2(monthlyTotals.sinIva),
      round2(monthlyTotals.iva),
    ],
    'totals',
    20
  );

  for (let c = 3; c < COLUMN_COUNT; c += 1) {
    moneyCells.push(XLSX.utils.encode_cell({ r: totalsRowIndex, c }));
  }

  const worksheet: WorkSheet = XLSX.utils.aoa_to_sheet(aoa);
  worksheet['!merges'] = merges;
  worksheet['!rows'] = rowHeights;
  worksheet['!cols'] = COLUMNS;

  const range = XLSX.utils.decode_range(worksheet['!ref'] as string);
  for (let r = range.s.r; r <= range.e.r; r += 1) {
    const kind = kinds[r];

    for (let c = range.s.c; c <= range.e.c; c += 1) {
      const address = XLSX.utils.encode_cell({ r, c });
      const cell = worksheet[address] as CellObject | undefined;
      if (!cell) continue;

      switch (kind) {
        case 'title':
          cell.s = titleStyle;
          break;
        case 'header':
          cell.s = headerStyle;
          break;
        case 'data': {
          const numeric = c >= 3;
          cell.s = cellStyle(r % 2 === 0, numeric);
          break;
        }
        case 'totals':
          cell.s = totalsStyle;
          break;
      }
    }
  }

  for (const address of moneyCells) {
    const cell = worksheet[address] as CellObject | undefined;
    if (cell) cell.z = '#,##0.00';
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, monthLabel.slice(0, 31));

  XLSX.writeFile(workbook, `facturas-${monthKey}.xlsx`);
};
