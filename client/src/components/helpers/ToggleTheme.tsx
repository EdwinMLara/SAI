import React from 'react';
import { motion } from 'framer-motion';

import Icon from '../ui/Icon';
import Button from '../ui/Button';
import { useTheme } from '@context/Theme.context';

const ThemeToggle: React.FC = () => {
   const { theme, toggleTheme } = useTheme();

   return (
      <Button
         variant="ghost"
         onClick={toggleTheme}
         className="relative overflow-hidden w-11 h-11 p-2"
         aria-label={`${theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}`}
      >
         <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{
               scale: theme === 'light' ? 1 : 0,
               rotate: theme === 'light' ? 0 : 180,
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center justify-center"
         >
            <Icon name="FaSun" size={20} />
         </motion.div>

         <motion.div
            initial={{ scale: 0, rotate: 180 }}
            animate={{
               scale: theme === 'dark' ? 1 : 0,
               rotate: theme === 'dark' ? 0 : -180,
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center justify-center"
         >
            <Icon name="FaMoon" size={20} />
         </motion.div>
      </Button>
   );
};

export default ThemeToggle;
