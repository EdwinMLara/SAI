import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

import { SalesNoteInterface } from '@interfaces/SalesNote.interfaces';

import { getProductTypeLabel } from '../utils/calculations';
import {
  formatCurrency,
  formatDate,
  formatDateTime,
} from '../utils/format';

interface SalesNoteViewProps {
  note: SalesNoteInterface;
}

const Field: React.FC<{
  label: string;
  value?: string | null;
  mono?: boolean;
}> = ({ label, value, mono = false }) => (
  <div>
    <dt className="text-xs uppercase tracking-wide text-secondary-color">
      {label}
    </dt>
    <dd
      className={`text-sm text-primary-color break-words ${
        mono ? 'font-mono text-xs' : ''
      }`}
    >
      {value || '-'}
    </dd>
  </div>
);

const SalesNoteView: React.FC<SalesNoteViewProps> = ({ note }) => {
  const isStamped = note.status === 'stamped';

  return (
    <div
      id="sales-note-print"
      className="bg-card border border-light rounded-md p-6 space-y-6"
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <img
            src="/logo-nota.png"
            alt="Logo"
            className="h-16 w-auto object-contain mb-3"
          />
          <p className="text-xs uppercase tracking-widest text-secondary-color">
            Nota de venta
          </p>
          <h2 className="text-2xl font-bold text-primary-color">
            {note.reference}
          </h2>
          <p className="text-sm text-secondary-color">
            {formatDate(note.date)}
          </p>
        </div>

        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
            isStamped
              ? 'bg-success-light text-success'
              : 'bg-warning-light text-warning'
          }`}
        >
          {isStamped ? 'Timbrada' : 'Borrador'}
        </span>
      </div>

      <section>
        <h3 className="text-lg font-semibold text-primary-color mb-3">
          Cliente
        </h3>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nombre" value={note.customer.name} />
          <Field label="RFC" value={note.customer.rfc} />
          <Field label="Correo" value={note.customer.email} />
          <Field label="Teléfono" value={note.customer.phone} />
          <div className="sm:col-span-2">
            <Field label="Dirección" value={note.customer.address} />
          </div>
        </dl>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-primary-color mb-3">
          Productos
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-border-light text-text-secondary dark:text-text-dark-secondary">
                <th className="py-3 px-2">Tipo</th>
                <th className="py-3 px-2">Descripción</th>
                <th className="py-3 px-2 text-right">Cantidad</th>
                <th className="py-3 px-2 text-right">Precio unitario</th>
                <th className="py-3 px-2 text-right">IVA</th>
                <th className="py-3 px-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {note.products.map((product, index) => (
                <tr
                  key={index}
                  className="border-b border-border-light last:border-0"
                >
                  <td className="py-3 px-2 text-primary-color">
                    {getProductTypeLabel(product.type)}
                  </td>
                  <td className="py-3 px-2 text-primary-color">
                    {product.description}
                  </td>
                  <td className="py-3 px-2 text-right tabular-nums">
                    {product.quantity}
                  </td>
                  <td className="py-3 px-2 text-right tabular-nums">
                    {formatCurrency(product.unitPrice)}
                  </td>
                  <td className="py-3 px-2 text-right tabular-nums">
                    {formatCurrency(product.iva)}
                  </td>
                  <td className="py-3 px-2 text-right tabular-nums font-medium">
                    {formatCurrency(product.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 ml-auto w-full max-w-xs rounded-md border border-border-light bg-background-secondary dark:bg-background-dark-secondary p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-secondary-color">Subtotal</span>
            <span className="tabular-nums">{formatCurrency(note.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-secondary-color">IVA</span>
            <span className="tabular-nums">{formatCurrency(note.iva)}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold border-t border-border-light pt-2">
            <span className="text-primary-color">Total general</span>
            <span className="text-primary-color tabular-nums">
              {formatCurrency(note.total)}
            </span>
          </div>
        </div>
      </section>

      {(note.comments || note.terms) && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {note.comments && (
            <div>
              <h3 className="text-sm font-semibold text-primary-color mb-1">
                Comentarios
              </h3>
              <p className="text-sm text-secondary-color whitespace-pre-wrap">
                {note.comments}
              </p>
            </div>
          )}
          {note.terms && (
            <div>
              <h3 className="text-sm font-semibold text-primary-color mb-1">
                Términos y condiciones
              </h3>
              <p className="text-sm text-secondary-color whitespace-pre-wrap">
                {note.terms}
              </p>
            </div>
          )}
        </section>
      )}

      <section className="border-t border-border-light pt-6">
        <h3 className="text-lg font-semibold text-primary-color mb-3">
          Sello fiscal
        </h3>

        {isStamped && note.fiscalStamp.qrString ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="RFC" value={note.customer.rfc} />
              <Field
                label="Fecha de timbrado"
                value={formatDateTime(note.fiscalStamp.stampedAt)}
              />
              <div className="sm:col-span-2">
                <Field
                  label="Sello SAT"
                  value={note.fiscalStamp.satStamp}
                  mono
                />
              </div>
              <div className="sm:col-span-2">
                <Field
                  label="Sello del emisor"
                  value={note.fiscalStamp.issuerStamp}
                  mono
                />
              </div>
              <div className="sm:col-span-2">
                <Field
                  label="Cadena original"
                  value={note.fiscalStamp.originalString}
                  mono
                />
              </div>
              <div className="sm:col-span-2">
                <Field
                  label="Cadena para el código QR"
                  value={note.fiscalStamp.qrString}
                  mono
                />
              </div>
            </dl>

            <div className="flex flex-col items-center gap-2">
              <div className="bg-white p-3 rounded-md">
                <QRCodeSVG
                  value={note.fiscalStamp.qrString}
                  size={190}
                  level="M"
                  includeMargin
                />
              </div>
              <p className="text-xs text-center text-secondary-color">
                Escanea para verificar en el SAT
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-secondary-color">
            Esta nota todavía no tiene sello fiscal. Puedes agregarlo desde la
            vista de actualización.
          </p>
        )}
      </section>
    </div>
  );
};

export default SalesNoteView;
