import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';

export type NotificationType =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'general';

interface NotificationProps {
  message: string;
  type?: NotificationType;
  show: boolean;
  onClose: () => void;
  duration?: number;
}

const typeConfig: Record<NotificationType, { icon: string; color: string }> = {
  success: {
    icon: 'FaCheckCircle',
    color: 'text-green-600 dark:text-green-400',
  },
  warning: {
    icon: 'FaExclamationTriangle',
    color: 'text-yellow-600 dark:text-yellow-400',
  },
  error: { icon: 'FaTimesCircle', color: 'text-red-600 dark:text-red-400' },
  info: { icon: 'FaInfoCircle', color: 'text-blue-600 dark:text-blue-400' },
  general: { icon: 'FaRegBell', color: 'text-gray-600 dark:text-gray-400' },
};

const Notification: React.FC<NotificationProps> = ({
  message,
  type = 'general',
  show,
  onClose,
  duration = 3500,
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const { icon, color } = typeConfig[type];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.25 }}
          className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 ${color}`}
          style={{ minWidth: 240, maxWidth: 320 }}
        >
          <Icon name={icon} size={22} className={color} />
          <span className="text-sm font-medium text-main">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
