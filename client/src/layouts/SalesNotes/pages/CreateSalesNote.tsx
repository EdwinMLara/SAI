import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { H1 } from '@components/semantic';
import { Button, InputFile, Message } from '@ui/index.ui';

import { SalesNoteCreateInput } from '@interfaces/SalesNote.interfaces';
import * as services from '@services/SalesNotes.services';

import SalesNoteForm, {
  SalesNoteDraft,
} from '../ui/SalesNoteForm';
import FiscalStampForm, {
  FiscalStampDraft,
  createEmptyFiscalStampDraft,
  validateFiscalStampDraft,
} from '../ui/FiscalStampForm';
import {
  calculateProduct,
  createEmptySalesNoteProduct,
} from '../utils/calculations';
import {
  formatDateTime,
  toDateInput,
  toDatetimeLocal,
} from '../utils/format';

const generateReference = (): string => {
  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(
    2,
    '0'
  )}${String(now.getDate()).padStart(2, '0')}`;
  const random = Math.floor(1000 + Math.random() * 9000);
  return `NV-${datePart}-${random}`;
};

const createEmptyDraft = (): SalesNoteDraft => ({
  reference: generateReference(),
  date: toDateInput(),
  customer: {
    name: '',
    rfc: '',
    email: '',
    phone: '',
    address: '',
  },
  products: [createEmptySalesNoteProduct()],
  comments: '',
  terms: '',
});

const validateDraft = (draft: SalesNoteDraft): string | null => {
  if (!draft.reference.trim()) return 'La referencia es obligatoria';
  if (!draft.customer.name.trim())
    return 'El nombre del cliente es obligatorio';
  if (draft.products.length === 0)
    return 'Agrega al menos un producto o servicio';

  const invalidProduct = draft.products.some((product) => {
    const purchasePrice = Number(product.purchasePrice) || 0;

    return (
      !product.description.trim() ||
      product.quantity <= 0 ||
      product.unitPrice < 0 ||
      (product.type === 'resale' && purchasePrice < 0)
    );
  });

  if (invalidProduct) {
    return 'Revisa los productos: descripción, cantidad mayor a 0 y precios válidos';
  }

  return null;
};

const CreateSalesNote = () => {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<SalesNoteDraft>(() =>
    createEmptyDraft()
  );
  const [fiscalStamp, setFiscalStamp] = useState<FiscalStampDraft>(
    createEmptyFiscalStampDraft
  );
  const [includeFiscalStamp, setIncludeFiscalStamp] =
    useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [fiscalMode, setFiscalMode] = useState<'xml' | 'manual'>('xml');
  const [selectedXml, setSelectedXml] = useState<File | null>(null);
  const [isParsingXml, setIsParsingXml] = useState<boolean>(false);
  const [xmlError, setXmlError] = useState<string>('');
  const [xmlSuccess, setXmlSuccess] = useState<string>('');
  const [xmlResetKey, setXmlResetKey] = useState<number>(0);

  const handleXmlUpload = async () => {
    if (!selectedXml) return;

    setIsParsingXml(true);
    setXmlError('');
    setXmlSuccess('');

    try {
      const response = await services.parseFiscalStampXml(selectedXml);
      const stamp = response.fiscalStamp;

      setFiscalStamp({
        rfc: stamp.rfc ?? '',
        satStamp: stamp.satStamp,
        issuerStamp: stamp.issuerStamp,
        originalString: stamp.originalString,
        stampedAt: toDatetimeLocal(stamp.stampedAt),
        qrString: stamp.qrString,
      });

      setDraft((current) => ({
        ...current,
        customer: {
          ...current.customer,
          rfc: current.customer.rfc?.trim()
            ? current.customer.rfc
            : stamp.rfc ?? '',
        },
      }));

      setXmlSuccess(response.message);
      setSelectedXml(null);
      setXmlResetKey((value) => value + 1);
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

    let validationError = validateDraft(draft);

    if (!validationError && includeFiscalStamp) {
      if (fiscalMode === 'xml' && !fiscalStamp.satStamp) {
        validationError =
          'Sube el XML timbrado o cambia a captura manual para agregar el sello fiscal';
      } else {
        validationError = validateFiscalStampDraft(fiscalStamp);
      }
    }

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const date = draft.date
        ? new Date(`${draft.date}T12:00:00`).toISOString()
        : new Date().toISOString();

      const payload: SalesNoteCreateInput = {
        reference: draft.reference.trim(),
        date,
        customer: {
          name: draft.customer.name.trim(),
          rfc: draft.customer.rfc?.trim() || null,
          email: draft.customer.email?.trim() || null,
          phone: draft.customer.phone?.trim() || null,
          address: draft.customer.address?.trim() || null,
        },
        products: draft.products.map((product) => {
          const calculated = calculateProduct(product);

          return {
            type: calculated.type,
            description: calculated.description.trim(),
            quantity: calculated.quantity,
            purchasePrice:
              calculated.type === 'resale' ? calculated.purchasePrice : 0,
            unitPrice: calculated.unitPrice,
            subtotal: calculated.subtotal,
            iva: calculated.iva,
            total: calculated.total,
          };
        }),
        comments: draft.comments.trim() || null,
        terms: draft.terms.trim() || null,
        fiscalStamp: includeFiscalStamp
          ? {
              satStamp: fiscalStamp.satStamp.trim(),
              issuerStamp: fiscalStamp.issuerStamp.trim(),
              originalString: fiscalStamp.originalString.trim(),
              stampedAt: new Date(fiscalStamp.stampedAt).toISOString(),
              qrString: fiscalStamp.qrString.trim(),
            }
          : undefined,
      };

      const response = await services.createSalesNote(payload);
      navigate(`/sales-notes/${encodeURIComponent(response.note.reference)}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo crear la nota de venta'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <H1>Nueva nota de venta</H1>
        <Link
          to="/sales-notes"
          className="text-brand font-semibold hover:underline text-sm"
        >
          Volver a notas
        </Link>
      </div>

      <Message type="error" message={error} show={Boolean(error)} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <SalesNoteForm value={draft} onChange={setDraft} />

        <div className="bg-card p-6 border border-light rounded-md">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4"
              checked={includeFiscalStamp}
              onChange={(event) =>
                setIncludeFiscalStamp(event.target.checked)
              }
              disabled={isSaving}
            />
            <span>
              <span className="block font-semibold text-primary-color">
                Agregar sello fiscal ahora (opcional)
              </span>
              <span className="block text-sm text-secondary-color mt-1">
                Puedes subir el XML timbrado o capturar los datos manualmente.
                Si no lo marcas, la nota se guardará como borrador y podrás
                agregar el sello después desde el detalle.
              </span>
            </span>
          </label>
        </div>

        {includeFiscalStamp && (
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button
                type="button"
                variant={fiscalMode === 'xml' ? 'primary' : 'secondary'}
                className="h-9 min-h-9 px-3 text-xs"
                onClick={() => setFiscalMode('xml')}
                disabled={isSaving}
              >
                Subir XML
              </Button>
              <Button
                type="button"
                variant={fiscalMode === 'manual' ? 'primary' : 'secondary'}
                className="h-9 min-h-9 px-3 text-xs"
                onClick={() => setFiscalMode('manual')}
                disabled={isSaving}
              >
                Capturar manualmente
              </Button>
            </div>

            {fiscalMode === 'manual' ? (
              <FiscalStampForm
                value={fiscalStamp}
                onChange={setFiscalStamp}
                showRfc={false}
              />
            ) : (
              <div className="bg-card p-6 border border-light rounded-md space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-primary-color">
                    Sello fiscal desde XML
                  </h3>
                  <p className="text-sm text-secondary-color mt-1">
                    Sube el XML del CFDI timbrado y sus datos se usarán al
                    guardar la nota.
                  </p>
                </div>

                <InputFile
                  accept=".xml,application/xml,text/xml"
                  onChange={setSelectedXml}
                  onContinue={handleXmlUpload}
                  continueLabel="Leer sello del XML"
                  helperText="Selecciona el XML del CFDI que ya fue timbrado"
                  disabled={isParsingXml || isSaving}
                  resetKey={xmlResetKey}
                />

                {isParsingXml && (
                  <Message type="info" message="Leyendo datos del XML..." />
                )}
                {xmlSuccess && <Message type="success" message={xmlSuccess} />}
                {xmlError && <Message type="error" message={xmlError} />}

                {fiscalStamp.satStamp && (
                  <div className="rounded-md border border-border-light bg-background-secondary dark:bg-background-dark-secondary p-4 space-y-3 text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="block text-xs uppercase tracking-wide text-secondary-color">
                          RFC
                        </span>
                        <span className="text-primary-color">
                          {fiscalStamp.rfc || '-'}
                        </span>
                      </div>
                      <div>
                        <span className="block text-xs uppercase tracking-wide text-secondary-color">
                          Fecha de timbrado
                        </span>
                        <span className="text-primary-color">
                          {fiscalStamp.stampedAt
                            ? formatDateTime(fiscalStamp.stampedAt)
                            : '-'}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-success">
                      Sello SAT, sello del emisor y cadena del QR cargados desde
                      el XML.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 flex-wrap">
          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar nota'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/sales-notes')}
            disabled={isSaving}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateSalesNote;
