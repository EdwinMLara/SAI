import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input, Button, Message } from '@ui/index';
import { changePassword } from '@services/User.services';

interface PasswordChangeFormProps {}

const PasswordChangeForm: React.FC<PasswordChangeFormProps> = () => {
   const [passwords, setPasswords] = useState({
      current: '',
      new: '',
      confirm: '',
   });
   const [errors, setErrors] = useState<Record<string, string>>({});
   const [isLoading, setIsLoading] = useState(false);
   const [message, setMessage] = useState<string | null>(null);
   const [messageType, setMessageType] = useState<'success' | 'error' | null>(
      null
   );

   const handleInputChange =
      (field: keyof typeof passwords) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
         setPasswords((prev) => ({
            ...prev,
            [field]: e.target.value,
         }));
         if (errors[field]) {
            setErrors((prev) => ({
               ...prev,
               [field]: '',
            }));
         }
      };

   const validateForm = (): boolean => {
      const newErrors: Record<string, string> = {};

      if (!passwords.current.trim()) {
         newErrors.current = 'La contraseña actual es requerida';
      }

      if (!passwords.new.trim()) {
         newErrors.new = 'La nueva contraseña es requerida';
      } else if (passwords.new.length < 6) {
         newErrors.new = 'La contraseña debe tener al menos 6 caracteres';
      } else if (passwords.new === passwords.current) {
         newErrors.new = 'La nueva contraseña no puede ser igual a la actual';
      }

      if (!passwords.confirm.trim()) {
         newErrors.confirm = 'Confirma la nueva contraseña';
      } else if (passwords.new !== passwords.confirm) {
         newErrors.confirm = 'Las contraseñas no coinciden';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;

      setIsLoading(true);
      setMessage(null);
      setMessageType(null);

      try {
         const response = await changePassword(
            passwords.current,
            passwords.new
         );
         if (response.success) {
            setMessage(response.message || 'Contraseña cambiada exitosamente');
            setMessageType('success');
            setPasswords({ current: '', new: '', confirm: '' });
         } else {
            setMessage(response.message || 'Error al cambiar contraseña');
            setMessageType('error');
         }
      } catch (error: any) {
         setMessage(error?.message || 'Error al cambiar contraseña');
         setMessageType('error');
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <>
         <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6"
         >
            <Input
               type="password"
               placeholder="Contraseña actual"
               value={passwords.current}
               onChange={handleInputChange('current')}
               error={errors.current}
               icon="FaLock"
               disabled={isLoading}
            />

            <Input
               type="password"
               placeholder="Nueva contraseña"
               value={passwords.new}
               onChange={handleInputChange('new')}
               error={errors.new}
               icon="FaKey"
               disabled={isLoading}
            />

            <Input
               type="password"
               placeholder="Confirmar nueva contraseña"
               value={passwords.confirm}
               onChange={handleInputChange('confirm')}
               error={errors.confirm}
               icon="FaKey"
               disabled={isLoading}
            />

            <div className="flex justify-end pt-4">
               <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading}
                  className="px-8"
               >
                  {isLoading ? 'Cambiando...' : 'Cambiar contraseña'}
               </Button>
            </div>
         </motion.form>

         {message && messageType && (
            <div className="w-full mt-4">
               <Message type={messageType} message={message} show={true} />
            </div>
         )}
      </>
   );
};

export default PasswordChangeForm;
