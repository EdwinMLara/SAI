import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import Button from '@ui/Button';
import { useAuth } from '@/context/Auth.context';

/* ------------------ Code ------------------ */

const Authentication = () => {
   const { isAuthenticated } = useAuth();
   const location = useLocation();
   const [isLoginForm, setIsLoginForm] = useState(true);

   if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      return <Navigate to={from} replace />;
   }

   const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
         opacity: 1,
         transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
         },
      },
   };

   const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
         opacity: 1,
         y: 0,
      },
   };

   return (
      <motion.div
         className="min-h-screen flex items-center justify-center p-4 bg-primary"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.8 }}
      >
         <div className="w-full max-w-md">
            <motion.div
               className="bg-card rounded-md shadow-medium backdrop-blur-sm bg-opacity-95 border border-light overflow-hidden"
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ duration: 0.4, delay: 0.2 }}
            >
               <div className="p-6 pb-2">
                  <div className="relative flex bg-secondary rounded-md p-1 mb-6">
                     <motion.div
                        className="absolute top-1 bottom-1 bg-brand rounded-md shadow-soft"
                        initial={false}
                        animate={{
                           left: isLoginForm ? '4px' : '50%',
                           width: 'calc(50% - 4px)',
                        }}
                        transition={{
                           type: 'spring',
                           stiffness: 400,
                           damping: 35,
                        }}
                     />

                     <motion.button
                        onClick={() => setIsLoginForm(true)}
                        className={`relative z-10 flex-1 py-3 px-4 text-sm font-semibold rounded-md transition-colors duration-200 ${
                           isLoginForm
                              ? 'text-white'
                              : 'text-secondary-color hover:text-primary-color'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                     >
                        Iniciar Sesión
                     </motion.button>

                     <motion.button
                        onClick={() => setIsLoginForm(false)}
                        className={`relative z-10 flex-1 py-3 px-4 text-sm font-semibold rounded-md transition-colors duration-200 ${
                           !isLoginForm
                              ? 'text-white'
                              : 'text-secondary-color hover:text-primary-color'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                     >
                        Crear Cuenta
                     </motion.button>
                  </div>
                  <motion.div
                     className="text-center mb-6"
                     variants={containerVariants}
                     initial="hidden"
                     animate="visible"
                  >
                     <motion.div variants={itemVariants}>
                        <h2 className="text-xl font-bold text-primary-color mb-2">
                           {isLoginForm
                              ? 'Acceder a tu cuenta'
                              : 'Crear una cuenta'}
                        </h2>
                     </motion.div>
                  </motion.div>
               </div>
            </motion.div>
         </div>
      </motion.div>
   );
};

export default Authentication;
