import { motion, AnimatePresence } from 'framer-motion';

import { H2 } from '@/components/semantic';
import { Input, Button, Message } from '@ui/index';

import { containerVariants, itemVariants, useLogin } from '../index';

/* ------------------ Code ------------------ */

const LoginForm = () => {
   const {
      loginData,
      isLoading,
      status,
      message,
      handleLogin,
      handleInputChange,
   } = useLogin();

   const messageType = status === 200 ? 'success' : 'error';

   /* ------------ Renderice ------------ */

   return (
      <AnimatePresence mode="wait">
         <motion.div
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{
               duration: 0.25,
               ease: [0.25, 0.1, 0.25, 1],
            }}
         >
            <motion.div
               className="text-center mb-6"
               variants={containerVariants}
               initial="hidden"
               animate="visible"
            >
               <motion.div variants={itemVariants}>
                  <h2 className="text-xl font-bold text-primary-color mb-2">
                     Acceder a tu cuenta
                  </h2>
               </motion.div>
            </motion.div>
            <motion.form
               className="space-y-4"
               variants={containerVariants}
               onSubmit={handleLogin}
               initial="hidden"
               animate="visible"
            >
               <motion.div variants={itemVariants}>
                  <Input
                     type="email"
                     placeholder="Escribe tu email"
                     icon="FaEnvelope"
                     value={loginData.email}
                     onChange={handleInputChange('email')}
                     disabled={isLoading}
                  />
               </motion.div>

               <motion.div>
                  <Input
                     type="password"
                     placeholder="Escribe tu contraseña"
                     icon="FaLock"
                     value={loginData.password}
                     onChange={handleInputChange('password')}
                     disabled={isLoading}
                  />
               </motion.div>

               <motion.div variants={itemVariants} className="pt-2">
                  <Button
                     type="submit"
                     variant="primary"
                     className="w-full mb-2"
                     disabled={isLoading}
                  >
                     {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                  </Button>
               </motion.div>

               {message && (
                  <motion.div
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: 10 }}
                     className="flex justify-center pt-4"
                  >
                     <div
                        className={`w-full max-w-md px-4 py-3 rounded-md text-center text-sm font-medium shadow-soft transition-all duration-300
                        ${
                           status === 200
                              ? 'bg-success-light text-success border border-success'
                              : ''
                        }
                        ${
                           status !== 200
                              ? 'bg-error-light text-error border border-error'
                              : ''
                        }
                      `}
                     >
                        {message}
                     </div>
                  </motion.div>
               )}
            </motion.form>
         </motion.div>
      </AnimatePresence>
   );
};

export default LoginForm;
