import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { Navigate, NavigationType, useLocation } from 'react-router-dom';

import { useAuth } from '@/context/Auth.context';
import { LoginForm, RegisterForm } from '../index';

/* ------------------ Code ------------------ */

const Authentication = () => {
   const location = useLocation();
   const [isLogin, setIsLogin] = useState(true);

   const { isAuthenticated } = useAuth();
   if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      return <Navigate to={from} replace />;
   }

   /* ------------ Renderice ------------ */

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
                           left: isLogin ? '4px' : '50%',
                           width: 'calc(50% - 4px)',
                        }}
                        transition={{
                           type: 'spring',
                           stiffness: 400,
                           damping: 35,
                        }}
                     />

                     <motion.button
                        onClick={() => setIsLogin(true)}
                        className={`relative z-10 flex-1 py-3 px-4 text-sm font-semibold rounded-md transition-colors duration-200 ${
                           isLogin
                              ? 'text-white'
                              : 'text-secondary-color hover:text-primary-color'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                     >
                        Iniciar Sesión
                     </motion.button>

                     <motion.button
                        onClick={() => setIsLogin(false)}
                        className={`relative z-10 flex-1 py-3 px-4 text-sm font-semibold rounded-md transition-colors duration-200 ${
                           !isLogin
                              ? 'text-white'
                              : 'text-secondary-color hover:text-primary-color'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                     >
                        Crear Cuenta
                     </motion.button>
                  </div>
               </div>
               <div className="px-6 pb-6">
                  {isLogin ? <LoginForm /> : <RegisterForm />}
               </div>
            </motion.div>
         </div>
      </motion.div>
   );
};

export default Authentication;
