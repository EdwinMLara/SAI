import React from 'react';
import { motion } from 'framer-motion';

interface InvalidRow {
  row: number;
  error: string;
}

interface ErrorListProps {
  invalidRows: InvalidRow[];
  maxDisplay?: number;
}

const ErrorList: React.FC<ErrorListProps> = ({
  invalidRows,
  maxDisplay = 10,
}) => {
  const displayErrors = invalidRows.slice(0, maxDisplay);
  const hasMoreErrors = invalidRows.length > maxDisplay;

  if (invalidRows.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <h4 className="font-semibold text-primary-color mb-3">
        Errores encontrados
      </h4>

      <div className="bg-error-light p-4 rounded-md border border-error max-h-48 overflow-y-auto scrollbar-thin">
        {displayErrors.map((invalid, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="mb-2 last:mb-0"
          >
            <span className="text-error font-medium text-sm">
              Fila {invalid.row}: {invalid.error}
            </span>
          </motion.div>
        ))}

        {hasMoreErrors && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="text-error text-sm mt-2"
          >
            ... y {invalidRows.length - maxDisplay} errores más
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export default ErrorList;
