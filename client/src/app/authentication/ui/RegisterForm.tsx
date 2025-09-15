import { motion, AnimatePresence } from 'framer-motion';

import { Input, Button, Message } from '@ui/index';
import { containerVariants, itemVariants, useRegister } from '../index';

/* ------------------ Code ------------------ */

const RegisterForm = () => {
   const {
      registerData,
      confirmPassword,
      isLoading,
      status,
      message,
      errors,
      handleRegister,
      handleInputChange,
      handleConfirmPassword,
   } = useRegister();

   const messageType = status === 200 ? 'success' : 'error';

   /* ------------ Renderice ------------ */

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
            <motion.div
               className="text-center mb-6"
               variants={containerVariants}
               initial="hidden"
               animate="visible"
            >
               <motion.div variants={itemVariants}>
                  <h2 className="text-xl font-bold text-primary-color mb-2">
                     Crear una cuenta
                  </h2>
               </motion.div>
            </motion.div>

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
                     onChange={handleInputChange('name')}
                     error={errors.name}
                     disabled={isLoading}
                  />
               </motion.div>

               <motion.div variants={itemVariants}>
                  <Input
                     type="text"
                     placeholder="Crea un usuario"
                     icon="FaUserCircle"
                     value={registerData.username}
                     onChange={handleInputChange('username')}
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
                     onChange={handleInputChange('email')}
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
                     onChange={handleInputChange('phone')}
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
                     onChange={handleInputChange('password')}
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
                     onChange={handleConfirmPassword}
                     error={errors.confirmPassword}
                     disabled={isLoading}
                  />
               </motion.div>

               <motion.div variants={itemVariants} className="pt-2">
                  <Button
                     type="submit"
                     variant="primary"
                     className="w-full"
                     disabled={isLoading}
                  >
                     {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
                  </Button>
               </motion.div>

               {message && messageType && (
                  <div className="w-full mt-4">
                     <Message type={messageType} message={message} />
                  </div>
               )}
            </motion.form>
         </motion.div>
      </AnimatePresence>
   );
};

export default RegisterForm;
