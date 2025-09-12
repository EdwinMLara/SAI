import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@ui/index';

interface LoadingStateProps {
   isVisible: boolean;
   message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
   isVisible,
   message = 'Buscando producto...',
}) => {
   if (!isVisible) return null;

   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -20 }}
         className="flex flex-col items-center justify-center py-16 px-6"
      >
         <div className="relative mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-brand-light to-brand rounded-full flex items-center justify-center shadow-strong">
               <Icon name="FaSearch" size={32} className="text-white" />
            </div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
         </div>

         <div className="text-center">
            <h3 className="text-xl font-semibold text-primary-color mb-2">
               Procesando búsqueda
            </h3>
            <p className="text-secondary-color mb-4">{message}</p>
            <div className="flex items-center justify-center gap-1">
               <div className="w-2 h-2 bg-brand rounded-full animate-bounce"></div>
               <div
                  className="w-2 h-2 bg-brand rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
               ></div>
               <div
                  className="w-2 h-2 bg-brand rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
               ></div>
            </div>
         </div>
      </motion.div>
   );
};

export default LoadingState;
