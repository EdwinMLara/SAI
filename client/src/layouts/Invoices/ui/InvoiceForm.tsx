import React from 'react';

import { InvoiceInterface } from '@interfaces/Invoice.interfaces';

interface InvoiceFormProps {
  invoice: InvoiceInterface;
  onChange: (invoice: InvoiceInterface) => void;
}

const fieldClass =
  'w-full px-3 py-2 rounded-md border border-border-light bg-background-secondary dark:bg-background-dark-secondary text-text-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-brand/40';

const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice, onChange }) => {
  const update = (patch: Partial<InvoiceInterface>) =>
    onChange({ ...invoice, ...patch });

  return (
    <div className="bg-card p-6 border border-light rounded-md">
      <h3 className="text-lg font-semibold text-primary-color mb-4">
        Información de la factura
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Referencia
          <input
            className={fieldClass}
            value={invoice.reference || ''}
            onChange={(e) => update({ reference: e.target.value })}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          RFC Emisor
          <input
            className={fieldClass}
            value={invoice.emisorRfc}
            onChange={(e) => update({ emisorRfc: e.target.value })}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Nombre Emisor
          <input
            className={fieldClass}
            value={invoice.emisorNombre}
            onChange={(e) => update({ emisorNombre: e.target.value })}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          RFC Receptor
          <input
            className={fieldClass}
            value={invoice.receptorRfc}
            onChange={(e) => update({ receptorRfc: e.target.value })}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Nombre Receptor
          <input
            className={fieldClass}
            value={invoice.receptorNombre}
            onChange={(e) => update({ receptorNombre: e.target.value })}
          />
        </label>

        <div className="flex flex-col gap-1 text-sm">
          UUID
          <span className="px-3 py-2 rounded-md border border-border-light bg-background-secondary/50 text-text-secondary truncate">
            {invoice.invoiceId}
          </span>
        </div>

        <div className="flex flex-col gap-1 text-sm">
          Fecha
          <span className="px-3 py-2 rounded-md border border-border-light bg-background-secondary/50 text-text-secondary">
            {new Date(invoice.date).toLocaleString('es-ES')}
          </span>
        </div>

        <div className="flex flex-col gap-1 text-sm">
          Vencimiento
          <span className="px-3 py-2 rounded-md border border-border-light bg-background-secondary/50 text-text-secondary">
            {new Date(invoice.expiration).toLocaleString('es-ES')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
