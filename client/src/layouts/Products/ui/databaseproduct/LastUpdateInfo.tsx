import React from 'react';
import { motion } from 'framer-motion';

interface LastUpdateInfoProps {
   lastUpdate: string | null;
   totalProducts?: number;
   isLoading: boolean;
   formatDate: (dateString: string | null) => string;
}

const LastUpdateInfo: React.FC<LastUpdateInfoProps> = ({
   lastUpdate,
   totalProducts = 0,
   isLoading,
   formatDate,
}) => {
   return (
      <motion.div
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.3 }}
         className="bg-card py-3 px-4 border border-light rounded-md"
      >
         <div className="text-primary-color text-sm space-y-1">
            <p>
               <span className="font-medium">Última actualización:</span>{' '}
               {isLoading ? (
                  <span className="animate-pulse">Cargando...</span>
               ) : (
                  formatDate(lastUpdate)
               )}
            </p>
            {!isLoading && totalProducts > 0 && (
               <p>
                  <span className="font-medium">Total de productos:</span>{' '}
                  {totalProducts.toLocaleString()}
               </p>
            )}
         </div>
      </motion.div>
   );
};

export default LastUpdateInfo;
