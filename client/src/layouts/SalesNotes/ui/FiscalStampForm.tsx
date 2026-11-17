import React from 'react';

export interface FiscalStampDraft {
  rfc: string;
  satStamp: string;
  issuerStamp: string;
  originalString: string;
  stampedAt: string;
  qrString: string;
}

export const createEmptyFiscalStampDraft = (): FiscalStampDraft => ({
  rfc: '',
  satStamp: '',
  issuerStamp: '',
  originalString: '',
  stampedAt: '',
  qrString: '',
});

export const validateFiscalStampDraft = (
  form: FiscalStampDraft
): string | null => {
  if (!form.satStamp.trim()) return 'El sello SAT es obligatorio';
  if (!form.issuerStamp.trim()) return 'El sello del emisor es obligatorio';
  if (!form.originalString.trim()) return 'La cadena original es obligatoria';
  if (!form.stampedAt) return 'La fecha de timbrado es obligatoria';
  if (!form.qrString.trim())
    return 'La cadena para el código QR es obligatoria';

  const stampedDate = new Date(form.stampedAt);
  if (isNaN(stampedDate.getTime())) {
    return 'La fecha de timbrado no es válida';
  }

  return null;
};

interface FiscalStampFormProps {
  value: FiscalStampDraft;
  onChange: (value: FiscalStampDraft) => void;
  showRfc?: boolean;
}

const fieldClass =
  'w-full px-3 py-2 rounded-md border border-border-light bg-background-secondary dark:bg-background-dark-secondary text-text-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-brand/40';

const textareaClass = `${fieldClass} min-h-[110px] resize-y font-mono text-xs`;

const FiscalStampForm: React.FC<FiscalStampFormProps> = ({
  value,
  onChange,
  showRfc = true,
}) => {
  const update = (patch: Partial<FiscalStampDraft>) =>
    onChange({ ...value, ...patch });

  return (
    <div className="bg-card p-6 border border-light rounded-md space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-primary-color">
          Datos del sello fiscal
        </h3>
        <p className="text-sm text-secondary-color mt-1">
          Copia y pega los datos tal como aparecen en el PDF o XML timbrado.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {showRfc && (
          <label className="flex flex-col gap-1 text-sm">
            RFC del cliente (opcional)
            <input
              className={fieldClass}
              value={value.rfc}
              placeholder="ABC010101AAA"
              onChange={(e) => update({ rfc: e.target.value })}
            />
          </label>
        )}

        <label className="flex flex-col gap-1 text-sm">
          Fecha de timbrado *
          <input
            type="datetime-local"
            className={fieldClass}
            value={value.stampedAt}
            onChange={(e) => update({ stampedAt: e.target.value })}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        Sello SAT *
        <textarea
          className={textareaClass}
          value={value.satStamp}
          placeholder="Pega aquí el sello digital del SAT"
          onChange={(e) => update({ satStamp: e.target.value })}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Sello del emisor *
        <textarea
          className={textareaClass}
          value={value.issuerStamp}
          placeholder="Pega aquí el sello digital del emisor"
          onChange={(e) => update({ issuerStamp: e.target.value })}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Cadena original *
        <textarea
          className={textareaClass}
          value={value.originalString}
          placeholder="||1.0|...|"
          onChange={(e) => update({ originalString: e.target.value })}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Cadena para el código QR *
        <textarea
          className={textareaClass}
          value={value.qrString}
          placeholder="https://verificacfdi.facturaelectronica.sat.gob.mx/?id=..."
          onChange={(e) => update({ qrString: e.target.value })}
        />
      </label>
    </div>
  );
};

export default FiscalStampForm;
