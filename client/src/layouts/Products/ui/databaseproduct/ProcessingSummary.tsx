import React from 'react';
import { motion } from 'framer-motion';

interface ProcessingSummaryProps {
   totalRows: number;
   validProducts: number;
   invalidRows: number;
}

const ProcessingSummary: React.FC<ProcessingSummaryProps> = ({
   totalRows,
   validProducts,
   invalidRows,
}) => {
   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
         className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
         <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="bg-tertiary p-4 rounded-md border border-light"
         >
            <div className="text-2xl font-bold text-primary-color">
               {totalRows}
            </div>
            <div className="text-secondary-color text-sm">Filas totales</div>
         </motion.div>

         <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="bg-success-light p-4 rounded-md border border-success"
         >
            <div className="text-2xl font-bold text-success">
               {validProducts}
            </div>
            <div className="text-success text-sm">Productos válidos</div>
         </motion.div>

         <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="bg-error-light p-4 rounded-md border border-error"
         >
            <div className="text-2xl font-bold text-error">{invalidRows}</div>
            <div className="text-error text-sm">Filas con errores</div>
         </motion.div>
      </motion.div>
   );
};

export default ProcessingSummary;
