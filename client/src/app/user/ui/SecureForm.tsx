import React, { useState } from 'react';
import { changePassword } from '@/core/services/User.services';
import { motion } from 'framer-motion';
import { Input, Alert, Message, Button } from '@/components/ui';

interface SecureFormProps {}

/* ------------------ Code ------------------ */

const SecureForm: React.FC<SecureFormProps> = () => {
   const [errors, setErrors] = useState<Record<string, string>>({});
   const [isLoading, setIsLoading] = useState(false);
   const [message, setMessage] = useState<string | null>(null);
   const [messageType, setMessageType] = useState<'success' | 'error' | null>(
      null
   );
   const [showAlert, setShowAlert] = useState(false);
   const [passwords, setPasswords] = useState({
      current: '',
      new: '',
      confirm: '',
   });

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

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setMessage(null);
      setMessageType(null);
      setShowAlert(true);
   };

   const handleConfirmSave = async () => {
      if (!validateForm()) {
         setShowAlert(false);
         return;
      }
      setIsLoading(true);
      setMessage(null);
      setMessageType(null);
      const res = await changePassword(passwords.current, passwords.new);
      setMessageType(res.success ? 'success' : 'error');
      setMessage(res.message);
      if (res.success) {
         setPasswords({ current: '', new: '', confirm: '' });
      }
      setIsLoading(false);
      setShowAlert(false);
   };

   const hasInput =
      passwords.current.trim() !== '' ||
      passwords.new.trim() !== '' ||
      passwords.confirm.trim() !== '';

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

            {hasInput && (
               <div className="flex flex-col gap-2 sm:flex-row sm:justify-end pt-4">
                  <Button
                     type="button"
                     variant="ghost"
                     disabled={isLoading}
                     className="w-full sm:w-auto order-2 sm:order-1"
                     onClick={() => {
                        setPasswords({ current: '', new: '', confirm: '' });
                        setErrors({});
                     }}
                  >
                     Descartar
                  </Button>

                  <Button
                     type="submit"
                     variant="primary"
                     disabled={isLoading}
                     className="px-8 w-full sm:w-auto order-1 sm:order-2"
                  >
                     {isLoading ? 'Cambiando...' : 'Cambiar contraseña'}
                  </Button>
               </div>
            )}
         </motion.form>

         {message && messageType && (
            <div className="w-full mt-4">
               <Message type={messageType} message={message} show={true} />
            </div>
         )}

         <Alert
            open={showAlert}
            message="¿Estás seguro de que deseas cambiar tu contraseña?"
            icon="FaRegSave"
            actions={[
               {
                  label: 'Cancelar',
                  onClick: () => setShowAlert(false),
                  variant: 'secondary',
               },
               {
                  label: 'Cambiar',
                  onClick: handleConfirmSave,
                  variant: 'primary',
               },
            ]}
            onClose={() => setShowAlert(false)}
         />
      </>
   );
};

export default SecureForm;
