import { useState } from 'react';

import { InvoiceInterface } from '@interfaces/Invoice.interfaces';
import * as services from '@services/Invoices.services';

interface UseInvoiceUploadReturn {
  isUploading: boolean;
  uploadSuccess: boolean;
  uploadMessage: string;
  uploadError: string;
  lastInvoice: InvoiceInterface | null;
  upload: (file: File) => Promise<void>;
  resetUpload: () => void;
}

const useInvoiceUpload = (): UseInvoiceUploadReturn => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');
  const [lastInvoice, setLastInvoice] = useState<InvoiceInterface | null>(null);

  const upload = async (file: File) => {
    setIsUploading(true);
    setUploadSuccess(false);
    setUploadError('');
    try {
      const response = await services.uploadXML(file);
      setLastInvoice(response.invoice);
      setUploadSuccess(true);
      setUploadMessage(response.message);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : 'No se pudo procesar el archivo XML'
      );
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setUploadSuccess(false);
    setUploadMessage('');
    setUploadError('');
    setLastInvoice(null);
  };

  return {
    isUploading,
    uploadSuccess,
    uploadMessage,
    uploadError,
    lastInvoice,
    upload,
    resetUpload,
  };
};

export default useInvoiceUpload;
