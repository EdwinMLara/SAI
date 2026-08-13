import React from 'react';

import { InvoicePayment } from '@interfaces/Invoice.interfaces';

const InvoicePayments: React.FC<{ payments: InvoicePayment[] }> = ({
  payments,
}) => {
  if (!payments || payments.length === 0) {
    return (
      <div className="bg-card p-6 border border-light rounded-md">
        <h3 className="text-lg font-semibold text-primary-color mb-2">Pagos</h3>
        <p className="text-sm text-text-secondary">Sin pagos registrados</p>
      </div>
    );
  }

  return (
    <div className="bg-card p-6 border border-light rounded-md overflow-x-auto">
      <h3 className="text-lg font-semibold text-primary-color mb-4">
        Pagos ({payments.length})
      </h3>

      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-border-light text-text-secondary dark:text-text-dark-secondary">
            <th className="py-3 px-2">Usuario</th>
            <th className="py-3 px-2">Transacción</th>
            <th className="py-3 px-2">Fecha</th>
            <th className="py-3 px-2">Monto</th>
            <th className="py-3 px-2">Estado</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr
              key={payment.transaction || index}
              className="border-b border-border-light last:border-0"
            >
              <td className="py-3 px-2">{payment.user}</td>
              <td className="py-3 px-2">{payment.transaction}</td>
              <td className="py-3 px-2">
                {new Date(payment.date).toLocaleDateString('es-ES')}
              </td>
              <td className="py-3 px-2">
                ${Number(payment.amount).toFixed(2)}
              </td>
              <td className="py-3 px-2">{payment.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoicePayments;
