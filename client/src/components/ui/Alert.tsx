import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';
import Button from './Button';
import IconButton from './IconButton';

export interface AlertAction {
   label: string;
   onClick: () => void;
   variant?: 'primary' | 'secondary' | 'ghost';
}

interface AlertProps {
   open: boolean;
   icon?: string;
   message: string;
   actions: AlertAction[];
   onClose: () => void;
   className?: string;
}

const Alert: React.FC<AlertProps> = ({
   open,
   icon,
   message,
   actions,
   onClose,
   className = '',
}) => {
   const displayIcon = icon || 'FaExclamationTriangle';
   return (
      <AnimatePresence>
         {open && (
            <motion.div
               className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
            >
               <motion.div
                  className={`bg-card shadow-medium dark:shadow-dark-medium p-6 w-full max-w-sm sm:max-w-md md:max-w-lg min-h-[180px] relative border border-light ${className}`}
                  initial={{ scale: 0.95, y: 40, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.95, y: 40, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
               >
                  <div className="flex flex-col items-center gap-4">
                     <div className="w-full flex justify-center">
                        <span className="inline-flex items-center justify-center rounded-full bg-info/15 border-2 border-info/30 p-4 shadow-lg transition-all duration-300">
                           <Icon
                              name={displayIcon}
                              size={34}
                              className="text-info drop-shadow-md"
                           />
                        </span>
                     </div>
                     <span className="text-lg text-primary-color text-center">
                        {message}
                     </span>
                     <div className="flex gap-3 mt-4">
                        {actions.map((action, idx) => (
                           <Button
                              key={action.label + idx}
                              variant={
                                 action.variant ||
                                 (action.label
                                    .toLowerCase()
                                    .includes('cancelar')
                                    ? 'secondary'
                                    : 'primary')
                              }
                              onClick={action.onClick}
                           >
                              {action.label}
                           </Button>
                        ))}
                     </div>
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
   );
};

export default Alert;
