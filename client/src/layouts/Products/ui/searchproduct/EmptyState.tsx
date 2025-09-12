import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@ui/index';

interface EmptyStateProps {
   isVisible: boolean;
   message?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
   isVisible,
   message = 'Utiliza el formulario de búsqueda para encontrar productos',
}) => {
   if (!isVisible) return null;

   return (
      <AnimatePresence>
         <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center justify-center py-16 px-6"
         >
            <div className="w-24 h-24 bg-tertiary rounded-full flex items-center justify-center mb-6">
               <Icon
                  name="FaBoxOpen"
                  size={40}
                  className="text-secondary-color"
               />
            </div>
            <h3 className="text-xl font-semibold text-primary-color mb-3">
               No hay productos para mostrar
            </h3>
            <p className="text-secondary-color text-center max-w-md leading-relaxed">
               {message}
            </p>
            <div className="flex items-center gap-2 mt-6 text-sm text-secondary-color">
               <Icon name="FaLightbulb" size={14} className="text-yellow-500" />
               <span>
                  Tip: Puedes buscar por código o descripción del producto
               </span>
            </div>
         </motion.div>
      </AnimatePresence>
   );
};

export default EmptyState;
