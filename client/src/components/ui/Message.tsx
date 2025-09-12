import React, { useEffect, useRef, useState } from 'react';
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
   const [visible, setVisible] = useState(show);
   const [progress, setProgress] = useState(100);
   const timerRef = useRef<NodeJS.Timeout | null>(null);

   useEffect(() => {
      if (show) {
         setVisible(true);
         setProgress(100);
         let start = Date.now();
         const duration = 5000;
         timerRef.current = setInterval(() => {
            const elapsed = Date.now() - start;
            const percent = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(percent);
            if (elapsed >= duration) {
               setVisible(false);
               if (onClose) onClose();
               if (timerRef.current) clearInterval(timerRef.current);
            }
         }, 50);
         return () => {
            if (timerRef.current) clearInterval(timerRef.current);
         };
      } else {
         setVisible(false);
      }
      // eslint-disable-next-line
   }, [show]);

   return (
      <AnimatePresence>
         {visible && message && (
            <motion.div
               initial={{ opacity: 0, y: 10, scale: 0.95 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, y: 10, scale: 0.95 }}
               transition={{
                  duration: 0.3,
                  ease: [0.25, 0.1, 0.25, 1],
               }}
               className={`w-full px-4 py-3 rounded-md text-center text-sm font-medium shadow-soft transition-all duration-300 border flex flex-col items-center ${config.bgColor} ${config.textColor} ${config.borderColor} ${className}`}
               style={{ width: '100%' }}
            >
               <div className="flex items-center justify-center gap-2 w-full">
                  <Icon name={displayIcon} size={16} />
                  <span className="flex-1 text-left">{message}</span>
                  <span className="flex items-center h-full">
                     <svg width="16" height="16" viewBox="0 0 16 16">
                        <circle
                           cx="8"
                           cy="8"
                           r="7"
                           fill="none"
                           stroke="currentColor"
                           strokeWidth="2"
                           opacity="0.2"
                        />
                        <circle
                           cx="8"
                           cy="8"
                           r="7"
                           fill="none"
                           stroke="currentColor"
                           strokeWidth="2"
                           strokeDasharray={2 * Math.PI * 7}
                           strokeDashoffset={
                              ((100 - progress) / 100) * 2 * Math.PI * 7
                           }
                           style={{
                              transition: 'stroke-dashoffset 0.1s linear',
                           }}
                        />
                     </svg>
                  </span>
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
