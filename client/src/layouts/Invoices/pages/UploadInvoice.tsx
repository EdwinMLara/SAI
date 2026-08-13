import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { H1 } from '@components/semantic';

import { useInvoiceUpload, UploadInvoiceSection } from '../';

const UploadInvoice = () => {
  const {
    isUploading,
    uploadSuccess,
    uploadMessage,
    uploadError,
    lastInvoice,
    upload,
    resetUpload,
  } = useInvoiceUpload();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resetKey, setResetKey] = useState(0);

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    resetUpload();
  };

  const handleFileContinue = async () => {
    if (!selectedFile || isUploading) return;
    try {
      await upload(selectedFile);
      setResetKey((key) => key + 1);
    } catch (error) {
      console.error('Error al subir el XML:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <H1>Subir factura</H1>
        <Link
          to="/invoices"
          className="text-brand font-semibold hover:underline text-sm"
        >
          Ver facturas →
        </Link>
      </div>

      <UploadInvoiceSection
        onFileChange={handleFileChange}
        onFileContinue={handleFileContinue}
        isUploading={isUploading}
        uploadSuccess={uploadSuccess}
        uploadMessage={uploadMessage}
        uploadError={uploadError}
        lastInvoice={lastInvoice}
        resetKey={resetKey}
      />
    </div>
  );
};

export default UploadInvoice;
