import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { H1 } from '@components/semantic';
import { Button, InputFile, Loading, Message } from '@ui/index.ui';

import * as services from '@services/SalesNotes.services';

import { useSalesNoteDetail } from '../';
import FiscalStampForm, {
  FiscalStampDraft,
  createEmptyFiscalStampDraft,
  validateFiscalStampDraft,
} from '../ui/FiscalStampForm';
import { formatCurrency, toDatetimeLocal } from '../utils/format';

const UpdateFiscalStamp = () => {
  const { reference = '' } = useParams<{ reference: string }>();
  const navigate = useNavigate();
  const { note, isLoading, error } = useSalesNoteDetail(reference);

  const [form, setForm] = useState<FiscalStampDraft>(
    createEmptyFiscalStampDraft
  );
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [selectedXml, setSelectedXml] = useState<File | null>(null);
  const [isParsingXml, setIsParsingXml] = useState<boolean>(false);
  const [xmlError, setXmlError] = useState<string>('');
  const [xmlSuccess, setXmlSuccess] = useState<string>('');
  const [xmlResetKey, setXmlResetKey] = useState<number>(0);

  useEffect(() => {
    if (!note) return;

    setForm({
      rfc: note.customer.rfc ?? '',
      satStamp: note.fiscalStamp.satStamp ?? '',
      issuerStamp: note.fiscalStamp.issuerStamp ?? '',
      originalString: note.fiscalStamp.originalString ?? '',
      stampedAt: toDatetimeLocal(note.fiscalStamp.stampedAt),
      qrString: note.fiscalStamp.qrString ?? '',
    });
  }, [note]);

  const handleXmlUpload = async () => {
    if (!selectedXml) return;

    setIsParsingXml(true);
    setXmlError('');
    setXmlSuccess('');

    try {
      const response = await services.uploadFiscalStampXml(
        reference,
        selectedXml
      );

      setXmlSuccess(response.message);
      setSelectedXml(null);
      setXmlResetKey((value) => value + 1);

      window.setTimeout(() => {
        navigate(`/sales-notes/${encodeURIComponent(reference)}`);
      }, 1200);
    } catch (err) {
      setXmlError(
        err instanceof Error
          ? err.message
          : 'No se pudo leer el XML timbrado'
      );
    } finally {
      setIsParsingXml(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const validationError = validateFiscalStampDraft(form);
    if (validationError) {
      setFormError(validationError);
      setSuccessMessage('');
      return;
    }

    setIsSaving(true);
    setFormError('');
    setSuccessMessage('');

    try {
      const response = await services.updateFiscalStamp({
        reference,
        rfc: form.rfc.trim() || null,
        fiscalStamp: {
          satStamp: form.satStamp.trim(),
          issuerStamp: form.issuerStamp.trim(),
          originalString: form.originalString.trim(),
          stampedAt: new Date(form.stampedAt).toISOString(),
          qrString: form.qrString.trim(),
        },
      });

      setSuccessMessage(response.message);
      window.setTimeout(() => {
        navigate(`/sales-notes/${encodeURIComponent(reference)}`);
      }, 1200);
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : 'No se pudo guardar el sello fiscal'
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loading message="Cargando nota de venta..." />;
  }

  if (error || !note) {
    return (
      <div className="space-y-4">
        <H1>Actualizar sello fiscal</H1>
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
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <H1>
          {note.status === 'stamped'
            ? 'Actualizar sello fiscal'
            : 'Agregar sello fiscal'}
        </H1>
        <Link
          to={`/sales-notes/${encodeURIComponent(reference)}`}
          className="text-brand font-semibold hover:underline text-sm"
        >
          Ver nota completa
        </Link>
      </div>

      <div className="bg-card p-4 border border-light rounded-md text-sm flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-secondary-color">Nota:</span>
        <span className="font-semibold text-primary-color">
          {note.reference}
        </span>
        <span className="text-secondary-color">·</span>
        <span>{note.customer.name}</span>
        <span className="text-secondary-color">·</span>
        <span>Total {formatCurrency(note.total)}</span>
      </div>

      <div className="bg-card p-6 border border-light rounded-md space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-primary-color">
            Cargar XML timbrado
          </h3>
          <p className="text-sm text-secondary-color mt-1">
            Sube el XML del CFDI timbrado y los datos del sello fiscal se
            extraerán y guardarán automáticamente.
          </p>
        </div>

        <InputFile
          accept=".xml,application/xml,text/xml"
          onChange={setSelectedXml}
          onContinue={handleXmlUpload}
          continueLabel="Cargar sello fiscal"
          helperText="Selecciona el XML del CFDI que ya fue timbrado"
          disabled={isParsingXml || isSaving}
          resetKey={xmlResetKey}
        />

        {isParsingXml && (
          <Message type="info" message="Leyendo datos del XML..." />
        )}
        {xmlSuccess && <Message type="success" message={xmlSuccess} />}
        {xmlError && <Message type="error" message={xmlError} />}
      </div>

      <Message
        type="success"
        message={successMessage}
        show={Boolean(successMessage)}
      />
      <Message type="error" message={formError} show={Boolean(formError)} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <FiscalStampForm value={form} onChange={setForm} />

        <div className="flex gap-3 flex-wrap">
          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar sello fiscal'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={isSaving}
            onClick={() =>
              navigate(`/sales-notes/${encodeURIComponent(reference)}`)
            }
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateFiscalStamp;
