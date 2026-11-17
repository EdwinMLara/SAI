import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { H1 } from '@components/semantic';
import { Button, Loading, Message } from '@ui/index.ui';

import { useSalesNoteDetail, SalesNoteView } from '../';
import { exportSalesNoteToPdf } from '../utils/exportSalesNoteToPdf';

const SalesNoteDetail = () => {
  const { reference = '' } = useParams<{ reference: string }>();
  const navigate = useNavigate();
  const { note, isLoading, error } = useSalesNoteDetail(reference);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [pdfError, setPdfError] = useState<string>('');

  const handleDownloadPdf = async () => {
    if (!note) return;

    setIsGeneratingPdf(true);
    setPdfError('');

    try {
      await exportSalesNoteToPdf(note);
    } catch (err) {
      setPdfError(
        err instanceof Error ? err.message : 'No se pudo generar el PDF'
      );
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (isLoading) {
    return <Loading message="Cargando nota de venta..." />;
  }

  if (error || !note) {
    return (
      <div className="space-y-4">
        <H1>Nota de venta</H1>
        <Message type="error" message={error || 'Nota de venta no encontrada'} />
        <Link
          to="/sales-notes"
          className="text-brand font-semibold hover:underline"
        >
          ← Volver a notas de venta
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap print:hidden">
        <H1>Nota de venta</H1>
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to="/sales-notes"
            className="text-brand font-semibold hover:underline text-sm"
          >
            ← Volver a notas
          </Link>
          <Button
            variant="secondary"
            className="h-9 min-h-9 px-3 text-xs"
            onClick={() =>
              navigate(
                `/sales-notes/${encodeURIComponent(reference)}/fiscal`
              )
            }
          >
            Actualizar sello fiscal
          </Button>
          <Button
            variant="secondary"
            className="h-9 min-h-9 px-3 text-xs"
            onClick={() => window.print()}
          >
            Imprimir
          </Button>
          <Button
            variant="primary"
            className="h-9 min-h-9 px-3 text-xs"
            disabled={isGeneratingPdf}
            onClick={handleDownloadPdf}
          >
            {isGeneratingPdf ? 'Generando PDF...' : 'Descargar PDF'}
          </Button>
        </div>
      </div>

      <Message type="error" message={pdfError} show={Boolean(pdfError)} />

      <SalesNoteView note={note} />
    </div>
  );
};

export default SalesNoteDetail;
