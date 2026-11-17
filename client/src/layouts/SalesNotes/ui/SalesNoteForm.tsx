import React from 'react';

import { Button } from '@ui/index.ui';
import {
  SalesNoteCustomer,
  SalesNoteProduct,
} from '@interfaces/SalesNote.interfaces';

import {
  IVA_RATE,
  PRODUCT_TYPE_OPTIONS,
  calculateNoteTotals,
  calculateProduct,
  createEmptySalesNoteProduct,
} from '../utils/calculations';

export interface SalesNoteDraft {
  reference: string;
  date: string;
  customer: SalesNoteCustomer;
  products: SalesNoteProduct[];
  comments: string;
  terms: string;
}

interface SalesNoteFormProps {
  value: SalesNoteDraft;
  onChange: (value: SalesNoteDraft) => void;
}

const fieldClass =
  'w-full px-3 py-2 rounded-md border border-border-light bg-background-secondary dark:bg-background-dark-secondary text-text-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-brand/40';

const textareaClass = `${fieldClass} min-h-[90px] resize-y`;

const SalesNoteForm: React.FC<SalesNoteFormProps> = ({ value, onChange }) => {
  const update = (patch: Partial<SalesNoteDraft>) =>
    onChange({ ...value, ...patch });

  const updateCustomer = (patch: Partial<SalesNoteCustomer>) =>
    update({ customer: { ...value.customer, ...patch } });

  const updateProduct = (
    index: number,
    patch: Partial<SalesNoteProduct>
  ) => {
    const products = value.products.map((product, i) => {
      if (i !== index) return product;
      return calculateProduct({ ...product, ...patch });
    });
    update({ products });
  };

  const addProduct = () =>
    update({
      products: [...value.products, createEmptySalesNoteProduct()],
    });

  const removeProduct = (index: number) =>
    update({ products: value.products.filter((_, i) => i !== index) });

  const totals = calculateNoteTotals(value.products);

  return (
    <div className="space-y-6">
      <section className="bg-card p-6 border border-light rounded-md">
        <h3 className="text-lg font-semibold text-primary-color mb-4">
          Datos generales
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1 text-sm">
            Referencia *
            <input
              className={fieldClass}
              value={value.reference}
              placeholder="NV-20261026-1234"
              onChange={(e) => update({ reference: e.target.value })}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Fecha *
            <input
              type="date"
              className={fieldClass}
              value={value.date}
              onChange={(e) => update({ date: e.target.value })}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Nombre del cliente *
            <input
              className={fieldClass}
              value={value.customer.name}
              placeholder="Nombre o razón social"
              onChange={(e) => updateCustomer({ name: e.target.value })}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            RFC (opcional)
            <input
              className={fieldClass}
              value={value.customer.rfc ?? ''}
              placeholder="ABC010101AAA"
              onChange={(e) => updateCustomer({ rfc: e.target.value })}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Correo
            <input
              type="email"
              className={fieldClass}
              value={value.customer.email ?? ''}
              placeholder="cliente@correo.com"
              onChange={(e) => updateCustomer({ email: e.target.value })}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Teléfono
            <input
              className={fieldClass}
              value={value.customer.phone ?? ''}
              placeholder="555 555 5555"
              onChange={(e) => updateCustomer({ phone: e.target.value })}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm md:col-span-2">
            Dirección
            <input
              className={fieldClass}
              value={value.customer.address ?? ''}
              placeholder="Calle, número, colonia, ciudad"
              onChange={(e) => updateCustomer({ address: e.target.value })}
            />
          </label>
        </div>
      </section>

      <section className="bg-card p-6 border border-light rounded-md">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
          <h3 className="text-lg font-semibold text-primary-color">
            Productos
          </h3>
          <Button
            type="button"
            variant="secondary"
            className="h-9 min-h-9 px-3 text-xs"
            onClick={addProduct}
          >
            + Agregar producto
          </Button>
        </div>

        {value.products.length === 0 ? (
          <p className="text-sm text-secondary-color">
            No hay productos. Agrega al menos uno para guardar la nota.
          </p>
        ) : (
          <div className="space-y-4">
            {value.products.map((product, index) => {
              const isResale = product.type === 'resale';
              const priceLabel =
                product.type === 'service'
                  ? 'Precio del servicio'
                  : 'Precio de venta';

              return (
                <div
                  key={index}
                  className="rounded-md border border-border-light bg-background-secondary/40 dark:bg-background-dark-secondary/40 p-4 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div
                      role="radiogroup"
                      aria-label={`Tipo del producto ${index + 1}`}
                      className="flex flex-wrap gap-2"
                    >
                      {PRODUCT_TYPE_OPTIONS.map((option) => {
                        const isActive = product.type === option.value;

                        return (
                          <label
                            key={option.value}
                            className={`inline-flex cursor-pointer items-center rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                              isActive
                                ? 'border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-dark-500 dark:bg-background-dark-tertiary dark:text-brand-dark-700'
                                : 'border-border-light text-secondary-color hover:bg-background-secondary dark:border-border-dark-light dark:text-text-dark-secondary dark:hover:bg-background-dark-secondary'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`product-type-${index}`}
                              value={option.value}
                              checked={isActive}
                              onChange={() =>
                                updateProduct(index, { type: option.value })
                              }
                              className="sr-only"
                            />
                            {option.label}
                          </label>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      className="text-error text-xs font-semibold hover:underline"
                      onClick={() => removeProduct(index)}
                    >
                      Quitar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
                    <label
                      className={`flex flex-col gap-1 text-sm ${
                        isResale ? 'lg:col-span-3' : 'lg:col-span-4'
                      }`}
                    >
                      Descripción *
                      <input
                        className={fieldClass}
                        value={product.description}
                        placeholder="Descripción del producto o servicio"
                        onChange={(e) =>
                          updateProduct(index, {
                            description: e.target.value,
                          })
                        }
                      />
                    </label>

                    <label className="flex flex-col gap-1 text-sm lg:col-span-1">
                      Cantidad *
                      <input
                        type="number"
                        min="0"
                        step="1"
                        className={fieldClass}
                        value={product.quantity}
                        onChange={(e) =>
                          updateProduct(index, {
                            quantity: Number(e.target.value) || 0,
                          })
                        }
                      />
                    </label>

                    {isResale && (
                      <label className="flex flex-col gap-1 text-sm lg:col-span-2">
                        Precio de compra
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className={fieldClass}
                          value={product.purchasePrice}
                          onChange={(e) =>
                            updateProduct(index, {
                              purchasePrice: Number(e.target.value) || 0,
                            })
                          }
                        />
                      </label>
                    )}

                    <label
                      className={`flex flex-col gap-1 text-sm ${
                        isResale ? 'lg:col-span-2' : 'lg:col-span-3'
                      }`}
                    >
                      {priceLabel} *
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className={fieldClass}
                        value={product.unitPrice}
                        onChange={(e) =>
                          updateProduct(index, {
                            unitPrice: Number(e.target.value) || 0,
                          })
                        }
                      />
                    </label>

                    <div className="flex flex-col gap-1 text-sm lg:col-span-2">
                      <span className="text-secondary-color">
                        IVA ({Math.round(IVA_RATE * 100)}%)
                      </span>
                      <span className="flex min-h-[38px] items-center rounded-md border border-border-light bg-background-secondary px-3 py-2 font-medium tabular-nums text-primary-color dark:bg-background-dark-secondary">
                        ${product.iva.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 text-sm text-right lg:col-span-2">
                      <span className="text-secondary-color">Total</span>
                      <span className="flex min-h-[38px] items-center justify-end rounded-md border border-border-light bg-background-secondary px-3 py-2 font-semibold tabular-nums text-primary-color dark:bg-background-dark-secondary">
                        ${product.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-4 ml-auto w-full max-w-xs rounded-md border border-border-light bg-background-secondary dark:bg-background-dark-secondary p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-secondary-color">Subtotal</span>
            <span className="tabular-nums">${totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-secondary-color">
              IVA ({Math.round(IVA_RATE * 100)}%)
            </span>
            <span className="tabular-nums">${totals.iva.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold border-t border-border-light pt-2">
            <span className="text-primary-color">Total</span>
            <span className="text-primary-color tabular-nums">
              ${totals.total.toFixed(2)}
            </span>
          </div>
        </div>
      </section>

      <section className="bg-card p-6 border border-light rounded-md space-y-4">
        <h3 className="text-lg font-semibold text-primary-color">
          Comentarios y condiciones
        </h3>

        <label className="flex flex-col gap-1 text-sm">
          Comentarios (opcional)
          <textarea
            className={textareaClass}
            value={value.comments}
            placeholder="Observaciones de la venta"
            onChange={(e) => update({ comments: e.target.value })}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Términos y condiciones (opcional)
          <textarea
            className={textareaClass}
            value={value.terms}
            placeholder="Condiciones de pago, entrega, garantía, etc."
            onChange={(e) => update({ terms: e.target.value })}
          />
        </label>
      </section>
    </div>
  );
};

export default SalesNoteForm;
