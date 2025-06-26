import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';
import Button from './Button';

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
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`bg-card rounded-lg shadow-lg p-6 w-full max-w-sm sm:max-w-md md:max-w-lg min-h-[180px] relative ${className}`}
            initial={{ scale: 0.95, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            <div className="flex flex-col items-center gap-4">
              {icon && (
                <div className="flex justify-center w-full">
                  <span className="flex items-center justify-center w-16 h-16 rounded-full border-2 border-secondaryDark bg-secondary/60 mb-2">
                    <Icon name={icon} size={32} className="text-primaryDark" />
                  </span>
                </div>
              )}
              <span className="text-base text-main text-center">{message}</span>
              <div className="flex gap-3 mt-4">
                {actions.map((action, idx) => (
                  <Button
                    key={action.label + idx}
                    variant={
                      action.variant ||
                      (action.label.toLowerCase().includes('cancelar')
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
            <Button
              variant="ghost"
              className="absolute top-3 right-3 p-2 text-2xl"
              onClick={onClose}
              aria-label="Cerrar"
            >
              <Icon name="FaTimes" />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;
