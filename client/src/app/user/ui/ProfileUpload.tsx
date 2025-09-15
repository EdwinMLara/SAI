import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { ProfileSection } from '../index';
import { InputFile, Button, Message } from '@ui/index';
import { updateProfileImage } from '@/core/services/User.services';
import { useAuth } from '@/context/Auth.context';

/* ------------------ Code ------------------ */

interface ProfileImageUploadProps {
   onClose: () => void;
   onSuccess?: (message: string) => void;
   onError?: (message: string) => void;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
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
   const [showComponent, setShowComponent] = useState(true);
   const fileInputRef = useRef<File | null>(null);
   const { updateUser } = useAuth();

   const compressImage = (
      file: File,
      maxWidth = 300,
      quality = 0.6
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
                  const compressedFile = new File(
                     [blob],
                     file.name.replace(/\.[^.]+$/, '.jpg'),
                     {
                        type: 'image/jpeg',
                     }
                  );
                  resolve(compressedFile);
               },
               'image/jpeg',
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
         const compressed = await compressImage(file);
         fileInputRef.current = compressed;
      } catch (e) {
         fileInputRef.current = file;
      }
   };

   const handleImageSubmit = async () => {
      setIsLoading(true);
      if (!fileInputRef.current) {
         setIsLoading(false);
         return;
      }
      const res = await updateProfileImage(fileInputRef.current);
      setMessageType(res.success ? 'success' : 'error');
      setMessage(res.message);
      setIsLoading(false);
      setResetImageKey((prev) => prev + 1);

      updateUser({ image: res.data.image });

      setTimeout(() => {
         setShowComponent(false);
         setMessage(null);
         setMessageType(null);
         if (onSuccess && res.success) onSuccess(res.message);
         if (onError && !res.success) onError(res.message);
         onClose();
         resetComponent();
      }, 3000);
   };

   const handleCancel = () => {
      setShowComponent(false);
      onClose();
      resetComponent();
   };

   const resetComponent = () => {
      setMessage(null);
      setMessageType(null);
      fileInputRef.current = null;
      setResetImageKey((prev) => prev + 1);
   };

   /* ------------ Renderice ------------ */

   return (
      <AnimatePresence>
         {showComponent && (
            <motion.div
               className="flex flex-col items-center justify-center space-y-4"
               initial={{ opacity: 0, y: 24 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 24 }}
               transition={{ duration: 0.35 }}
               key="profile-upload-root"
            >
               <AnimatePresence>
                  {!messageType && (
                     <motion.div
                        className="flex gap-3 justify-center w-full"
                        key="form"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 16 }}
                        transition={{ duration: 0.25 }}
                     >
                        <InputFile
                           helperText="Selecciona una imagen"
                           accept="image/*"
                           onChange={handleFileChange}
                           onContinue={handleImageSubmit}
                           onCancel={handleCancel}
                           resetKey={resetImageKey}
                           disabled={isLoading}
                        />
                     </motion.div>
                  )}
               </AnimatePresence>
               <AnimatePresence>
                  {messageType && message && (
                     <motion.div
                        key="message"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                     >
                        <Message
                           type={messageType}
                           message={message}
                           show={true}
                           key={Date.now()}
                        />
                     </motion.div>
                  )}
               </AnimatePresence>
            </motion.div>
         )}
      </AnimatePresence>
   );
};

export default ProfileImageUpload;
