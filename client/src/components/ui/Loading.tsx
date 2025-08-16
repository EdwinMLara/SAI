import React from 'react';
import { motion } from 'framer-motion';

/* ------------------ Code ------------------ */

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Cargando...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[120px] w-full bg-background-primary dark:bg-background-dark-primary">
      <motion.div
        className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <motion.p
        className="mt-4 text-text-primary dark:text-text-dark-primary text-base font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {message}
      </motion.p>
    </div>
  );
};

export default Loading;
