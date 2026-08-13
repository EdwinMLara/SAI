import React from 'react';

import { InputFile, Message } from '@ui/index.ui';
import { InvoiceInterface } from '@interfaces/Invoice.interfaces';

interface UploadInvoiceSectionProps {
  onFileChange: (file: File | null) => void;
  onFileContinue: () => void;
  isUploading: boolean;
  uploadSuccess: boolean;
  uploadMessage: string;
  uploadError: string;
  lastInvoice: InvoiceInterface | null;
  resetKey: string | number;
}

const UploadInvoiceSection: React.FC<UploadInvoiceSectionProps> = ({
  onFileChange,
  onFileContinue,
  isUploading,
  uploadSuccess,
  uploadMessage,
  uploadError,
  lastInvoice,
  resetKey,
}) => {
  return (
    <div className="bg-card p-6 border border-light rounded-md space-y-4">
      <h3 className="text-lg font-semibold text-primary-color">
        Subir factura (XML)
      </h3>

      <InputFile
        accept=".xml"
        onChange={onFileChange}
        onContinue={onFileContinue}
        helperText="Selecciona un archivo XML de CFDI para procesarlo y guardarlo en la base de datos"
        disabled={isUploading}
        resetKey={resetKey}
      />

      {isUploading && <Message type="info" message="Procesando archivo XML..." />}

      {uploadSuccess && <Message type="success" message={uploadMessage} />}

      {uploadError && <Message type="error" message={uploadError} />}

      {lastInvoice && !uploadError && (
        <div className="text-sm text-text-secondary dark:text-text-dark-secondary bg-background-secondary dark:bg-background-dark-secondary border border-border-light rounded-md px-4 py-3">
          Factura procesada: <span className="font-semibold">{lastInvoice.reference || lastInvoice.invoiceId}</span> — Emisor:{' '}
          {lastInvoice.emisorNombre || lastInvoice.emisorRfc}
        </div>
      )}
    </div>
  );
};

export default UploadInvoiceSection;
