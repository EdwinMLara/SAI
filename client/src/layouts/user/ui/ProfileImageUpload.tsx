import React, { useState, useRef } from 'react';
import ProfileSection from './ProfileSection';
import { InputFile, Button } from '@ui/index';
import Message from '@/components/ui/Message';
import { updateProfileImage } from '@/core/services/User.services';

interface ProfileImageUploadProps {
   isVisible: boolean;
   onClose: () => void;
   onSuccess?: (message: string) => void;
   onError?: (message: string) => void;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
   isVisible,
   onClose,
   onSuccess,
   onError,
}) => {
   const [isLoading, setIsLoading] = useState(false);
   const [resetImageKey, setResetImageKey] = useState(0);
   const [message, setMessage] = useState<string | null>(null);
   const [messageType, setMessageType] = useState<'success' | 'error' | null>(
      null
   );
   const fileInputRef = useRef<File | null>(null);

   // Comprime/redimensiona la imagen antes de guardarla
   const compressImage = (
      file: File,
      maxWidth = 600,
      quality = 0.7
   ): Promise<File> => {
      return new Promise((resolve, reject) => {
         const img = new window.Image();
         const reader = new FileReader();
         reader.onload = (e) => {
            if (!e.target) return reject('Error leyendo archivo');
            img.src = e.target.result as string;
         };
         img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            if (width > maxWidth) {
               height = Math.round((height * maxWidth) / width);
               width = maxWidth;
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx)
               return reject('No se pudo obtener el contexto del canvas');
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(
               (blob) => {
                  if (!blob) return reject('No se pudo comprimir la imagen');
                  const compressedFile = new File([blob], file.name, {
                     type: file.type,
                  });
                  resolve(compressedFile);
               },
               file.type,
               quality
            );
         };
         img.onerror = (err) => reject(err);
         reader.onerror = (err) => reject(err);
         reader.readAsDataURL(file);
      });
   };

   const handleFileChange = async (file: File | null) => {
      if (!file) {
         fileInputRef.current = null;
         return;
      }
      try {
         // Comprimir/redimensionar antes de guardar
         const compressed = await compressImage(file);
         fileInputRef.current = compressed;
      } catch (e) {
         fileInputRef.current = file; // fallback
      }
   };

   const handleImageSubmit = async () => {
      if (!fileInputRef.current) return;

      setIsLoading(true);
      setMessage(null);
      setMessageType(null);

      try {
         const response = await updateProfileImage(fileInputRef.current);
         if (response.success) {
            const successMessage =
               response.message || 'Imagen actualizada exitosamente';
            setMessage(successMessage);
            setMessageType('success');
            setResetImageKey((prev) => prev + 1);

            // Notificar al componente padre del éxito
            onSuccess?.(successMessage);

            // Cerrar el modal después de un breve delay
            setTimeout(() => {
               onClose();
               resetComponent();
            }, 1500);
         } else {
            const errorMessage =
               response.message || 'Error al actualizar imagen';
            setMessage(errorMessage);
            setMessageType('error');
            onError?.(errorMessage);
         }
      } catch (error: any) {
         const errorMessage = error?.message || 'Error al actualizar imagen';
         setMessage(errorMessage);
         setMessageType('error');
         onError?.(errorMessage);
      } finally {
         setIsLoading(false);
      }
   };

   const handleCancel = () => {
      onClose();
      resetComponent();
   };

   const resetComponent = () => {
      setMessage(null);
      setMessageType(null);
      fileInputRef.current = null;
      setResetImageKey((prev) => prev + 1);
   };

   if (!isVisible) {
      return null;
   }

   return (
      <ProfileSection title="Actualizar imagen de perfil">
         <div className="flex flex-col items-center justify-center space-y-4">
            <InputFile
               accept="image/*"
               onChange={handleFileChange}
               onContinue={handleImageSubmit}
               resetKey={resetImageKey}
               helperText="Selecciona una imagen para tu perfil"
               disabled={isLoading}
            />
            {message && messageType && (
               <div className="w-full mt-2">
                  <Message type={messageType} message={message} show={true} />
               </div>
            )}
            <div className="flex gap-3 justify-center w-full">
               <Button
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={isLoading}
               >
                  Cancelar
               </Button>
            </div>
         </div>
      </ProfileSection>
   );
};

export default ProfileImageUpload;
