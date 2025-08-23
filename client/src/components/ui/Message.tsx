import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';

type MessageType = 'success' | 'error' | 'warning' | 'info' | 'neutral';

interface MessageProps {
   type: MessageType;
   message: string;
   show?: boolean;
   icon?: string;
   className?: string;
   onClose?: () => void;
}

const messageConfig = {
   success: {
      bgColor: 'bg-success-light dark:bg-success-dark-light',
      textColor: 'text-success dark:text-success-dark-DEFAULT',
      borderColor: 'border-success dark:border-success-dark-DEFAULT',
      icon: 'FaCheckCircle',
   },
   error: {
      bgColor: 'bg-error-light dark:bg-error-dark-light',
      textColor: 'text-error dark:text-error-dark-DEFAULT',
      borderColor: 'border-error dark:border-error-dark-DEFAULT',
      icon: 'FaExclamationCircle',
   },
   warning: {
      bgColor: 'bg-warning-light dark:bg-warning-dark-light',
      textColor: 'text-warning dark:text-warning-dark-DEFAULT',
      borderColor: 'border-warning dark:border-warning-dark-DEFAULT',
      icon: 'FaExclamationTriangle',
   },
   info: {
      bgColor: 'bg-info-light dark:bg-info-dark-light',
      textColor: 'text-info dark:text-info-dark-DEFAULT',
      borderColor: 'border-info dark:border-info-dark-DEFAULT',
      icon: 'FaInfoCircle',
   },
   neutral: {
      bgColor: 'bg-background-secondary dark:bg-background-dark-secondary',
      textColor: 'text-text-primary dark:text-text-dark-primary',
      borderColor: 'border-border-light dark:border-border-dark-light',
      icon: 'FaBell',
   },
};

const Message: React.FC<MessageProps> = ({
   type,
   message,
   show = true,
   icon,
   className = '',
   onClose,
}) => {
   const config = messageConfig[type];
   const displayIcon = icon || config.icon;

   return (
      <AnimatePresence>
         {show && message && (
            <motion.div
               initial={{ opacity: 0, y: 10, scale: 0.95 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, y: 10, scale: 0.95 }}
               transition={{
                  duration: 0.3,
                  ease: [0.25, 0.1, 0.25, 1],
               }}
               className={`
            w-full max-w-md px-4 py-3 rounded-md text-center text-sm font-medium 
            shadow-soft transition-all duration-300 border
            ${config.bgColor} ${config.textColor} ${config.borderColor}
            ${className}
          `}
            >
               <div className="flex items-center justify-center gap-2">
                  <Icon name={displayIcon} size={16} />
                  <span>{message}</span>
                  {onClose && (
                     <button
                        onClick={onClose}
                        className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
                        aria-label="Cerrar mensaje"
                     >
                        <Icon name="FaTimes" size={14} />
                     </button>
                  )}
               </div>
            </motion.div>
         )}
      </AnimatePresence>
   );
};

export default Message;
