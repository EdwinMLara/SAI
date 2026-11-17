import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { toDataURL } from 'qrcode';

import type { SalesNoteInterface } from '@interfaces/SalesNote.interfaces';

import { getProductTypeLabel } from './calculations';
import { formatCurrency, formatDate, formatDateTime } from './format';

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 14;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const MAX_Y = PAGE_HEIGHT - 22;

const LOGO_URL = '/logo-nota.png';

type RGB = [number, number, number];

const COLOR = {
  accent: [31, 41, 55] as RGB,
  dark: [30, 41, 59] as RGB,
  gray: [100, 116, 139] as RGB,
  border: [226, 232, 240] as RGB,
  background: [248, 250, 252] as RGB,
  white: [255, 255, 255] as RGB,
  success: [21, 128, 61] as RGB,
  successLight: [220, 252, 231] as RGB,
  warning: [180, 83, 9] as RGB,
  warningLight: [254, 243, 199] as RGB,
};

interface LogoData {
  dataUrl: string;
  format: 'PNG' | 'JPEG' | 'WEBP';
  width: number;
  height: number;
}

interface PdfContext {
  doc: jsPDF;
  note: SalesNoteInterface;
  logo: LogoData | null;
  y: number;
}

const loadLogo = async (): Promise<LogoData | null> => {
  try {
    const response = await fetch(LOGO_URL, { cache: 'force-cache' });
    if (!response.ok) return null;

    const blob = await response.blob();

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });

    const dimensions = await new Promise<{ width: number; height: number }>(
      (resolve, reject) => {
        const image = new Image();
        image.onload = () =>
          resolve({
            width: image.naturalWidth || 1,
            height: image.naturalHeight || 1,
          });
        image.onerror = () => reject(new Error('No se pudo leer el logo'));
        image.src = dataUrl;
      }
    );

    const type = blob.type.toLowerCase();
    const format: LogoData['format'] = type.includes('jpeg')
      ? 'JPEG'
      : type.includes('jpg')
        ? 'JPEG'
        : type.includes('webp')
          ? 'WEBP'
          : 'PNG';

    return { dataUrl, format, ...dimensions };
  } catch {
    return null;
  }
};

const drawLogo = (
  doc: jsPDF,
  logo: LogoData | null,
  x: number,
  y: number,
  maxWidth: number,
  maxHeight: number
): number => {
  if (!logo) return 0;

  const ratio = Math.min(maxWidth / logo.width, maxHeight / logo.height);
  const width = logo.width * ratio;
  const height = logo.height * ratio;

  doc.addImage(logo.dataUrl, logo.format, x, y, width, height);
  return height;
};

const drawStatusPill = (
  doc: jsPDF,
  label: string,
  isStamped: boolean,
  rightX: number,
  y: number
): void => {
  const paddingX = 3;
  const height = 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  const width = doc.getTextWidth(label) + paddingX * 2;

  doc.setFillColor(...(isStamped ? COLOR.successLight : COLOR.warningLight));
  doc.roundedRect(rightX - width, y, width, height, 3, 3, 'F');

  doc.setTextColor(...(isStamped ? COLOR.success : COLOR.warning));
  doc.text(label, rightX - width / 2, y + height / 2 + 1.1, {
    align: 'center',
  });
};

const drawFirstHeader = (
  ctx: PdfContext
): number => {
  const { doc, note, logo } = ctx;
  const rightX = PAGE_WIDTH - MARGIN;
  const logoHeight = drawLogo(doc, logo, MARGIN, MARGIN, 48, 24);
  const isStamped = note.status === 'stamped';

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...COLOR.dark);
  doc.text('NOTA DE VENTA', rightX, MARGIN + 6, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLOR.gray);
  doc.text(`Referencia: ${note.reference}`, rightX, MARGIN + 12, {
    align: 'right',
  });
  doc.text(formatDate(note.date), rightX, MARGIN + 17, { align: 'right' });

  drawStatusPill(
    doc,
    isStamped ? 'Timbrada' : 'Borrador',
    isStamped,
    rightX,
    MARGIN + 21
  );

  const headerBottom = MARGIN + Math.max(logoHeight, 30);

  doc.setDrawColor(...COLOR.border);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, headerBottom + 2, rightX, headerBottom + 2);

  return headerBottom + 9;
};

const drawContinuationHeader = (
  ctx: PdfContext
): number => {
  const { doc, note, logo } = ctx;
  const rightX = PAGE_WIDTH - MARGIN;
  const logoHeight = drawLogo(doc, logo, MARGIN, MARGIN, 30, 12);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...COLOR.dark);
  doc.text(`Nota de venta ${note.reference}`, rightX, MARGIN + 5, {
    align: 'right',
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR.gray);
  doc.text('Continuación', rightX, MARGIN + 10, { align: 'right' });

  const bottom = MARGIN + Math.max(logoHeight, 14);

  doc.setDrawColor(...COLOR.border);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, bottom + 2, rightX, bottom + 2);

  return bottom + 8;
};

const ensureSpace = (ctx: PdfContext, needed: number): void => {
  if (ctx.y + needed <= MAX_Y) return;
  ctx.doc.addPage();
  ctx.y = drawContinuationHeader(ctx);
};

const drawSectionTitle = (ctx: PdfContext, title: string): void => {
  ensureSpace(ctx, 12);

  ctx.doc.setFont('helvetica', 'bold');
  ctx.doc.setFontSize(11);
  ctx.doc.setTextColor(...COLOR.accent);
  ctx.doc.text(title.toUpperCase(), MARGIN, ctx.y);

  ctx.doc.setDrawColor(...COLOR.border);
  ctx.doc.setLineWidth(0.3);
  ctx.doc.line(MARGIN, ctx.y + 2, PAGE_WIDTH - MARGIN, ctx.y + 2);

  ctx.y += 7;
};

const drawField = (
  doc: jsPDF,
  label: string,
  value: string | null | undefined,
  x: number,
  y: number,
  width: number,
  maxLines = 1
): void => {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR.gray);
  doc.text(label.toUpperCase(), x, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLOR.dark);

  const lines = doc.splitTextToSize(value?.trim() || '-', width);
  doc.text(lines.slice(0, maxLines), x, y + 4);
};

const drawCustomerSection = (ctx: PdfContext): void => {
  const { doc, note } = ctx;

  drawSectionTitle(ctx, 'Cliente');

  const innerX = MARGIN + 6;
  const gap = 8;
  const columnWidth = (CONTENT_WIDTH - 12 - gap) / 2;
  const rightColumnX = innerX + columnWidth + gap;
  const addressWidth = CONTENT_WIDTH - 12;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const addressLines = doc.splitTextToSize(
    note.customer.address?.trim() || '-',
    addressWidth
  );
  const addressHeight = 4 + Math.min(addressLines.length, 4) * 4;

  const rowHeight = 10;
  const boxHeight = 5 + rowHeight * 2 + addressHeight + 5;

  ensureSpace(ctx, boxHeight + 6);
  const boxTop = ctx.y;

  doc.setFillColor(...COLOR.background);
  doc.setDrawColor(...COLOR.border);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGIN, boxTop, CONTENT_WIDTH, boxHeight, 2, 2, 'FD');

  let fieldY = boxTop + 5;

  drawField(
    doc,
    'Nombre',
    note.customer.name,
    innerX,
    fieldY,
    columnWidth
  );
  drawField(
    doc,
    'RFC',
    note.customer.rfc,
    rightColumnX,
    fieldY,
    columnWidth
  );

  fieldY += rowHeight;

  drawField(
    doc,
    'Correo',
    note.customer.email,
    innerX,
    fieldY,
    columnWidth
  );
  drawField(
    doc,
    'Teléfono',
    note.customer.phone,
    rightColumnX,
    fieldY,
    columnWidth
  );

  fieldY += rowHeight;

  drawField(
    doc,
    'Dirección',
    note.customer.address,
    innerX,
    fieldY,
    addressWidth,
    4
  );

  ctx.y = boxTop + boxHeight + 6;
};

const getFinalY = (doc: jsPDF): number => {
  const last = (
    doc as jsPDF & { lastAutoTable?: { finalY?: number } }
  ).lastAutoTable;
  return last?.finalY ?? 0;
};

const drawProductsSection = (ctx: PdfContext): void => {
  const { doc, note } = ctx;

  drawSectionTitle(ctx, 'Productos');

  autoTable(doc, {
    startY: ctx.y,
    head: [['Tipo', 'Descripción', 'Cantidad', 'Precio unitario', 'IVA', 'Total']],
    body: note.products.map((product) => [
      getProductTypeLabel(product.type),
      product.description,
      String(product.quantity),
      formatCurrency(product.unitPrice),
      formatCurrency(product.iva),
      formatCurrency(product.total),
    ]),
    margin: { left: MARGIN, right: MARGIN },
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 8,
      cellPadding: 2,
      textColor: COLOR.dark,
      lineColor: COLOR.border,
      lineWidth: 0.2,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: COLOR.accent,
      textColor: COLOR.white,
      fontStyle: 'bold',
      fontSize: 8,
    },
    alternateRowStyles: { fillColor: COLOR.background },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 68 },
      2: { cellWidth: 14, halign: 'right' },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 22, halign: 'right' },
      5: { cellWidth: 28, halign: 'right', fontStyle: 'bold' },
    },
  });

  ctx.y = getFinalY(doc) + 6;
};

const drawTotals = (ctx: PdfContext): void => {
  const { doc, note } = ctx;
  const boxWidth = 80;
  const x = PAGE_WIDTH - MARGIN - boxWidth;
  const boxHeight = 30;

  ensureSpace(ctx, boxHeight + 4);

  doc.setFillColor(...COLOR.background);
  doc.setDrawColor(...COLOR.border);
  doc.setLineWidth(0.3);
  doc.roundedRect(x, ctx.y, boxWidth, boxHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLOR.gray);
  doc.text('Subtotal', x + 5, ctx.y + 7);
  doc.setTextColor(...COLOR.dark);
  doc.text(formatCurrency(note.subtotal), x + boxWidth - 5, ctx.y + 7, {
    align: 'right',
  });

  doc.setTextColor(...COLOR.gray);
  doc.text('IVA', x + 5, ctx.y + 14);
  doc.setTextColor(...COLOR.dark);
  doc.text(formatCurrency(note.iva), x + boxWidth - 5, ctx.y + 14, {
    align: 'right',
  });

  doc.setDrawColor(...COLOR.border);
  doc.line(x + 5, ctx.y + 18, x + boxWidth - 5, ctx.y + 18);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...COLOR.dark);
  doc.text('Total general', x + 5, ctx.y + 25);
  doc.setTextColor(...COLOR.accent);
  doc.text(formatCurrency(note.total), x + boxWidth - 5, ctx.y + 25, {
    align: 'right',
  });

  ctx.y += boxHeight + 6;
};

const drawParagraph = (
  ctx: PdfContext,
  title: string,
  text: string
): void => {
  const { doc } = ctx;

  drawSectionTitle(ctx, title);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLOR.dark);

  const lines = doc.splitTextToSize(text, CONTENT_WIDTH);

  for (const line of lines) {
    ensureSpace(ctx, 5);
    doc.text(line, MARGIN, ctx.y);
    ctx.y += 4.5;
  }

  ctx.y += 4;
};

const drawFiscalField = (
  ctx: PdfContext,
  label: string,
  value: string | null | undefined,
  x: number,
  width: number,
  fiscalPage: number
): void => {
  const { doc } = ctx;

  ensureSpace(ctx, 10);

  const currentWidth =
    doc.getCurrentPageInfo().pageNumber === fiscalPage ? width : CONTENT_WIDTH;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR.gray);
  doc.text(label.toUpperCase(), x, ctx.y);
  ctx.y += 3.6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR.dark);

  const lines = doc.splitTextToSize(value?.trim() || '-', currentWidth);

  for (const line of lines) {
    ensureSpace(ctx, 4);
    doc.text(line, x, ctx.y);
    ctx.y += 3.4;
  }

  ctx.y += 3;
};

const drawFiscalSection = async (ctx: PdfContext): Promise<void> => {
  const { doc, note } = ctx;

  drawSectionTitle(ctx, 'Sello fiscal');

  const isStamped = note.status === 'stamped' && Boolean(note.fiscalStamp.qrString);

  if (!isStamped) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...COLOR.gray);
    doc.text(
      'Esta nota todavía no tiene sello fiscal.',
      MARGIN,
      ctx.y
    );
    ctx.y += 8;
    return;
  }

  const qrSize = 40;
  const qrX = PAGE_WIDTH - MARGIN - qrSize;

  ensureSpace(ctx, qrSize + 10);

  const qrY = ctx.y;
  const fiscalPage = doc.getCurrentPageInfo().pageNumber;
  const leftWidth = qrX - MARGIN - 10;

  const qrImage = await toDataURL(note.fiscalStamp.qrString as string, {
    margin: 1,
    width: 320,
    errorCorrectionLevel: 'M',
  });

  doc.setFillColor(...COLOR.white);
  doc.roundedRect(qrX - 2, qrY - 2, qrSize + 4, qrSize + 4, 2, 2, 'F');
  doc.addImage(qrImage, 'PNG', qrX, qrY, qrSize, qrSize);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...COLOR.gray);
  doc.text(
    'Escanear para verificar en el SAT',
    qrX + qrSize / 2,
    qrY + qrSize + 5,
    { align: 'center' }
  );

  drawFiscalField(ctx, 'RFC', note.customer.rfc, MARGIN, leftWidth, fiscalPage);
  drawFiscalField(
    ctx,
    'Fecha de timbrado',
    formatDateTime(note.fiscalStamp.stampedAt),
    MARGIN,
    leftWidth,
    fiscalPage
  );
  drawFiscalField(
    ctx,
    'Sello SAT',
    note.fiscalStamp.satStamp,
    MARGIN,
    leftWidth,
    fiscalPage
  );
  drawFiscalField(
    ctx,
    'Sello del emisor',
    note.fiscalStamp.issuerStamp,
    MARGIN,
    leftWidth,
    fiscalPage
  );
  drawFiscalField(
    ctx,
    'Cadena original',
    note.fiscalStamp.originalString,
    MARGIN,
    leftWidth,
    fiscalPage
  );
  drawFiscalField(
    ctx,
    'Cadena para el código QR',
    note.fiscalStamp.qrString,
    MARGIN,
    leftWidth,
    fiscalPage
  );

  if (doc.getCurrentPageInfo().pageNumber === fiscalPage) {
    ctx.y = Math.max(ctx.y, qrY + qrSize + 8);
  }

  ctx.y += 2;
};

const drawFooter = (ctx: PdfContext): void => {
  const { doc, note } = ctx;
  const totalPages = doc.getNumberOfPages();

  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLOR.gray);
    doc.text(`Nota ${note.reference}`, MARGIN, PAGE_HEIGHT - 10);
    doc.text(`Página ${page} de ${totalPages}`, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 10, {
      align: 'right',
    });
  }
};

export async function exportSalesNoteToPdf(
  note: SalesNoteInterface
): Promise<void> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

  doc.setProperties({
    title: `Nota de venta ${note.reference}`,
    subject: 'Nota de venta',
    creator: 'SAI',
  });

  const logo = await loadLogo();

  const ctx: PdfContext = {
    doc,
    note,
    logo,
    y: 0,
  };

  ctx.y = drawFirstHeader(ctx);
  drawCustomerSection(ctx);
  drawProductsSection(ctx);
  drawTotals(ctx);

  if (note.comments?.trim()) {
    drawParagraph(ctx, 'Comentarios', note.comments);
  }

  if (note.terms?.trim()) {
    drawParagraph(ctx, 'Términos y condiciones', note.terms);
  }

  await drawFiscalSection(ctx);

  drawFooter(ctx);

  const safeReference = note.reference.replace(/[^a-zA-Z0-9-_]/g, '_');
  doc.save(`Nota-${safeReference}.pdf`);
}
