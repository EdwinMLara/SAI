import React from 'react';

import { InvoiceProduct } from '@interfaces/Invoice.interfaces';

interface ProductEditTableProps {
  products: InvoiceProduct[];
  onChange: (products: InvoiceProduct[]) => void;
}

const inputClass =
  'w-full px-2 py-1 rounded-md border border-border-light bg-background-secondary dark:bg-background-dark-secondary text-text-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-brand/40';

const ProductEditTable: React.FC<ProductEditTableProps> = ({
  products,
  onChange,
}) => {
  const updateProduct = (index: number, patch: Partial<InvoiceProduct>) => {
    const next = products.map((p, i) =>
      i === index ? { ...p, ...patch } : p
    );
    onChange(next);
  };

  if (products.length === 0) {
    return (
      <div className="bg-card p-6 border border-light rounded-md">
        <h3 className="text-lg font-semibold text-primary-color mb-2">
          Productos
        </h3>
        <p className="text-sm text-text-secondary">Sin productos registrados</p>
      </div>
    );
  }

  return (
    <div className="bg-card p-6 border border-light rounded-md overflow-x-auto">
      <h3 className="text-lg font-semibold text-primary-color mb-4">
        Productos ({products.length})
      </h3>

      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-border-light text-text-secondary dark:text-text-dark-secondary">
            <th className="py-3 px-2">Clave</th>
            <th className="py-3 px-2">Clave Prod/Serv</th>
            <th className="py-3 px-2">Clave Unidad</th>
            <th className="py-3 px-2">Descripción</th>
            <th className="py-3 px-2">Cantidad</th>
            <th className="py-3 px-2 text-right">Precio</th>
            <th className="py-3 px-2 text-right">IVA</th>
            <th className="py-3 px-2 text-right">Precio c/IVA</th>
            <th className="py-3 px-2">Estado</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr
              key={`${product.key}-${index}`}
              className="border-b border-border-light last:border-0"
            >
              <td className="py-3 px-2 font-medium">{product.key}</td>
              <td className="py-3 px-2">{product.claveProdServ || '-'}</td>
              <td className="py-3 px-2">{product.claveUnidad || '-'}</td>
              <td className="py-3 px-2">
                <input
                  className={inputClass}
                  value={product.description}
                  onChange={(e) =>
                    updateProduct(index, { description: e.target.value })
                  }
                />
              </td>
              <td className="py-3 px-2">
                <input
                  type="number"
                  min="0"
                  className={`w-20 ${inputClass}`}
                  value={product.quantity}
                  onChange={(e) =>
                    updateProduct(index, {
                      quantity: Number(e.target.value) || 0,
                    })
                  }
                />
              </td>
              <td className="py-3 px-2 text-right">
                ${Number(product.prices.payment).toFixed(2)}
              </td>
              <td className="py-3 px-2 text-right">
                ${Number(product.prices.iva || 0).toFixed(2)}
              </td>
              <td className="py-3 px-2 text-right font-medium">
                ${Number(product.prices.priceWithIva || 0).toFixed(2)}
              </td>
              <td className="py-3 px-2">
                <select
                  className={inputClass}
                  value={product.status}
                  onChange={(e) =>
                    updateProduct(index, { status: e.target.value })
                  }
                >
                  <option value="activo">Activo</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="entregado">Entregado</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {(() => {
        const subtotal = products.reduce(
          (acc, p) => acc + (Number(p.prices.payment) || 0) * p.quantity,
          0
        );
        const iva = products.reduce(
          (acc, p) => acc + (Number(p.prices.iva) || 0),
          0
        );
        const total = products.reduce(
          (acc, p) =>
            acc + (Number(p.prices.priceWithIva) || 0) * p.quantity,
          0
        );
        return (
          <div className="mt-4 ml-auto w-full max-w-xs rounded-md border border-border-light bg-background-secondary dark:bg-background-dark-secondary p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Total sin IVA</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">IVA total</span>
              <span className="font-medium">${iva.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold border-t border-border-light pt-2">
              <span className="text-primary-color">Total con IVA</span>
              <span className="text-primary-color">${total.toFixed(2)}</span>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default ProductEditTable;
