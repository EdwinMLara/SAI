import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/Auth.context';
import useFormValidation from '@/app/authentication/hooks/useValidations';
import { motion } from 'framer-motion';
import { Input, Button, Message, Alert } from '@/components/ui';
import { UserChangesInt } from '@common/interfaces';
import { updateUser } from '@/core/services/User.services';

/* ------------------ Code ------------------ */

interface ProfileFormProps {
   initialData: Partial<UserChangesInt>;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ initialData }) => {
   const [formData, setFormData] =
      useState<Partial<UserChangesInt>>(initialData);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [showAlert, setShowAlert] = useState(false);
   const [message, setMessage] = useState<string | null>(null);
   const [messageType, setMessageType] = useState<'success' | 'error' | null>(
      null
   );
   const { updateUser: updateAuthUser } = useAuth();

   useEffect(() => {
      if (message && !hasChanges()) {
         setMessage(null);
         setMessageType(null);
      }
   }, [formData]);

   const {
      errors,
      validateField,
      validateForm,
      clearError,
      clearAllErrors,
      formatName,
      formatUsername,
      formatPhone,
   } = useFormValidation();

   const validationRules = {
      name: true,
      username: true,
      email: true,
      phone: true,
   };

   const handleInputChange =
      (field: keyof UserChangesInt) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
         let value = e.target.value;
         if (field === 'name') value = formatName(value);
         if (field === 'username') value = formatUsername(value);
         if (field === 'phone') value = formatPhone(value);
         setFormData((prev) => ({ ...prev, [field]: value }));
         clearError(field);
      };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (isLoading || !hasChanges()) return;
      setMessage(null);
      setMessageType(null);
      setShowAlert(true);
   };

   const handleConfirmSave = async () => {
      if (isLoading) return;
      setMessage(null);
      setMessageType(null);
      const data = {
         name: formData.name || '',
         username: formData.username || '',
         email: formData.email || '',
         phone: formData.phone || '',
      };
      if (!validateForm(data, validationRules)) {
         setShowAlert(false);
         return;
      }
      const changedFields: Partial<UserChangesInt> = {};
      const keys = Object.keys(initialData) as (keyof UserChangesInt)[];
      for (const key of keys) {
         if ((formData[key] || '') !== (initialData[key] || '')) {
            changedFields[key] = formData[key];
         }
      }
      if (Object.keys(changedFields).length === 0) {
         setShowAlert(false);
         return;
      }

      setIsLoading(true);
      delete changedFields.password;
      const res = await updateUser(changedFields);
      setMessage(res.message);
      setMessageType(res.success ? 'success' : 'error');
      if (res.success) {
         updateAuthUser({ ...initialData, ...changedFields });
      }
      setIsLoading(false);
      setShowAlert(false);
   };

   const handleReset = () => {
      setFormData(initialData);
      clearAllErrors();
   };

   const hasChanges = () => {
      const keys = Object.keys(initialData) as (keyof UserChangesInt)[];
      for (const key of keys) {
         if ((formData[key] || '') !== (initialData[key] || '')) {
            return true;
         }
      }
      return false;
   };

   return (
      <>
         <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-6"
         >
            <Input
               type="email"
               placeholder="Correo electrónico"
               value={formData.email || ''}
               onChange={handleInputChange('email')}
               error={errors.email}
               icon="FaEnvelope"
               disabled={true}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Input
                  type="text"
                  placeholder="Nombre completo"
                  value={formData.name || ''}
                  onChange={handleInputChange('name')}
                  error={errors.name}
                  icon="FaUser"
                  disabled={isLoading}
               />

               <Input
                  type="text"
                  placeholder="Nombre de usuario"
                  value={formData.username || ''}
                  onChange={handleInputChange('username')}
                  error={errors.username}
                  icon="FaAt"
                  disabled={isLoading}
               />
            </div>

            <Input
               type="tel"
               placeholder="Número de teléfono"
               value={formData.phone || ''}
               onChange={handleInputChange('phone')}
               error={errors.phone}
               icon="FaPhone"
               disabled={isLoading}
            />

            {hasChanges() && (
               <div className="flex flex-col-reverse gap-2 py-4 md:flex-row md:justify-end">
                  <Button
                     type="button"
                     variant="ghost"
                     disabled={isLoading}
                     className="w-full md:w-auto px-8"
                     onClick={handleReset}
                  >
                     Descartar
                  </Button>
                  <Button
                     type="submit"
                     variant="primary"
                     disabled={isLoading}
                     className="w-full md:w-auto px-8"
                  >
                     {isLoading ? 'Guardando...' : 'Guardar cambios'}
                  </Button>
               </div>
            )}
         </motion.form>

         {message && messageType && (
            <div className="w-full mt-4">
               <Message
                  key={Date.now()}
                  type={messageType}
                  message={message}
                  show={true}
               />
            </div>
         )}

         <Alert
            open={showAlert}
            message="¿Estás seguro de que deseas guardar los cambios en tu perfil?"
            icon="FaRegSave"
            actions={[
               {
                  label: 'Cancelar',
                  onClick: () => setShowAlert(false),
                  variant: 'secondary',
               },
               {
                  label: 'Guardar',
                  onClick: handleConfirmSave,
                  variant: 'primary',
               },
            ]}
            onClose={() => setShowAlert(false)}
         />
      </>
   );
};

export default ProfileForm;
