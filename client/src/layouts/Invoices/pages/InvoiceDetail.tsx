import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

import { Loading, Button, Message } from '@ui/index.ui';
import { H1 } from '@components/semantic';

import {
  useInvoiceDetail,
  InvoiceForm,
  ProductEditTable,
  InvoicePayments,
} from '../';

const InvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    invoice,
    setInvoice,
    isLoading,
    error,
    isSaving,
    isDeleting,
    save,
    remove,
  } = useInvoiceDetail(id ?? '');

  const [saveMessage, setSaveMessage] = useState<string>('');
  const [saveError, setSaveError] = useState<string>('');

  const handleSave = async () => {
    if (!invoice) return;
    try {
      const response = await save(invoice);
      setSaveMessage(response.message);
      setSaveError('');
    } catch (error) {
      setSaveError('No se pudo guardar la factura');
      setSaveMessage('');
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      '¿Seguro que deseas eliminar esta factura?'
    );
    if (!confirmed) return;
    try {
      await remove();
      navigate('/invoices');
    } catch (error) {
      setSaveError('No se pudo eliminar la factura');
    }
  };

  if (isLoading) {
    return <Loading message="Cargando factura..." />;
  }

  if (error || !invoice) {
    return (
      <div className="space-y-4">
        <H1>Factura</H1>
        <Message type="error" message={error || 'Factura no encontrada'} />
        <Link
          to="/invoices"
          className="text-brand font-semibold hover:underline"
        >
          ← Volver a facturas
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <H1>Factura {invoice.reference || invoice.invoiceId}</H1>
        <Link
          to="/invoices"
          className="text-brand font-semibold hover:underline text-sm"
        >
          ← Volver a facturas
        </Link>
      </div>

      <Message type="success" message={saveMessage} show={Boolean(saveMessage)} />
      <Message type="error" message={saveError} show={Boolean(saveError)} />

      <InvoiceForm invoice={invoice} onChange={setInvoice} />

      <ProductEditTable
        products={invoice.products}
        onChange={(products) => setInvoice({ ...invoice, products })}
      />

      <InvoicePayments payments={invoice.payments} />

      <div className="flex gap-3 flex-wrap">
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Guardando...' : 'Guardar cambios'}
        </Button>
        <Button
          variant="secondary"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Eliminando...' : 'Eliminar factura'}
        </Button>
      </div>
    </div>
  );
};

export default InvoiceDetail;
