import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Input, Button } from '@ui/index.ui';
import { useRegister } from '../index';

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

const RegisterForm: React.FC = () => {
   const {
      registerData,
      confirmPassword,
      isLoading,
      resStatus,
      resMessage,
      errors,
      handleRegister,
      handleRegisterInputChange,
      handleConfirmPasswordChange,
   } = useRegister();

   return (
      <AnimatePresence mode="wait">
         <motion.div
            key="register"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{
               duration: 0.25,
               ease: [0.25, 0.1, 0.25, 1],
            }}
         >
            <motion.form
               onSubmit={handleRegister}
               className="space-y-4"
               variants={containerVariants}
               initial="hidden"
               animate="visible"
            >
               <motion.div variants={itemVariants}>
                  <Input
                     type="text"
                     placeholder="Escribe tu nombre"
                     icon="FaUser"
                     value={registerData.name}
                     onChange={handleRegisterInputChange('name')}
                     error={errors.name}
                     disabled={isLoading}
                     autoComplete="off"
                  />
               </motion.div>

               <motion.div variants={itemVariants}>
                  <Input
                     type="text"
                     placeholder="Crea un usuario"
                     icon="FaUserCircle"
                     value={registerData.username}
                     onChange={handleRegisterInputChange('username')}
                     error={errors.username}
                     disabled={isLoading}
                  />
               </motion.div>

               <motion.div variants={itemVariants}>
                  <Input
                     type="email"
                     placeholder="Escribe tu email"
                     icon="FaEnvelope"
                     value={registerData.email}
                     onChange={handleRegisterInputChange('email')}
                     error={errors.email}
                     disabled={isLoading}
                  />
               </motion.div>

               <motion.div variants={itemVariants}>
                  <Input
                     type="tel"
                     placeholder="Escribe tu teléfono"
                     icon="FaPhone"
                     value={registerData.phone}
                     onChange={handleRegisterInputChange('phone')}
                     error={errors.phone}
                     disabled={isLoading}
                  />
               </motion.div>

               <motion.div variants={itemVariants}>
                  <Input
                     type="password"
                     placeholder="Escribe tu contraseña"
                     icon="FaLock"
                     value={registerData.password}
                     onChange={handleRegisterInputChange('password')}
                     error={errors.password}
                     disabled={isLoading}
                  />
               </motion.div>

               <motion.div variants={itemVariants}>
                  <Input
                     type="password"
                     placeholder="Confirma tu contraseña"
                     icon="FaLock"
                     value={confirmPassword}
                     onChange={handleConfirmPasswordChange}
                     error={errors.confirmPassword}
                     disabled={isLoading}
                  />
               </motion.div>

               <motion.div variants={itemVariants}>
                  <Button
                     type="submit"
                     variant="primary"
                     className="w-full mt-6 text-lg py-3 shadow-medium hover:shadow-strong transition-all duration-300"
                     disabled={isLoading}
                  >
                     {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                           <span>Creando cuenta...</span>
                        </div>
                     ) : (
                        'Crear Cuenta'
                     )}
                  </Button>
               </motion.div>
            </motion.form>

            {resMessage && (
               <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex justify-center pt-4"
               >
                  <div
                     className={`w-full max-w-md px-4 py-3 rounded-md text-center text-sm font-medium shadow-soft transition-all duration-300
                        ${
                           resStatus === 200
                              ? 'bg-success-light text-success border border-success'
                              : ''
                        }
                        ${
                           resStatus !== 200
                              ? 'bg-error-light text-error border border-error'
                              : ''
                        }
                      `}
                  >
                     {resMessage}
                  </div>
               </motion.div>
            )}
         </motion.div>
      </AnimatePresence>
   );
};

export default RegisterForm;
