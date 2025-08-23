import React from 'react';
import { motion } from 'framer-motion';

interface LastUpdateInfoProps {
   lastUpdate: Date | null;
   isLoading: boolean;
   formatDate: (date: Date | null) => string;
}

const LastUpdateInfo: React.FC<LastUpdateInfoProps> = ({
   lastUpdate,
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
         <p className="text-primary-color text-sm">
            <span className="font-medium">Última actualización:</span>{' '}
            {isLoading ? (
               <span className="animate-pulse">Cargando...</span>
            ) : (
               formatDate(lastUpdate)
            )}
         </p>
      </motion.div>
   );
};

export default LastUpdateInfo;
