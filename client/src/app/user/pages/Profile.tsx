import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/Auth.context';
import { UserChangesInt } from '@common/interfaces';
import { Button, Message } from '@ui/index';
import {
   ProfileHeader,
   ProfileImageUpload,
   ProfileSection,
   ProfileForm,
   SecureForm,
} from '../index';

/* ------------------ Code ------------------ */

function Profile() {
   const { user } = useAuth();
   const navigate = useNavigate();

   const [showImageUpload, setShowImageUpload] = useState<boolean>(false);

   if (!user) {
      return <p>Usuario no encontrado</p>;
   }

   const initialData: Partial<UserChangesInt> = {
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
   };

   const handleImageUpload = () => {
      setShowImageUpload(true);
   };

   const handleImageUploadClose = () => {
      setShowImageUpload(false);
   };

   /* ------------ Renderice ------------ */

   return (
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.5 }}
         className="container mx-auto px-4 py-8 max-w-6xl"
      >
         <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3 w-full flex flex-col gap-8 lg:sticky lg:top-8 self-start h-fit">
               <div className="mb-2 lg:mb-0">
                  <Button
                     onClick={() => navigate('/')}
                     variant="secondary"
                     className="w-full lg:w-auto"
                  >
                     Inicio
                  </Button>
               </div>
               <ProfileHeader user={user} onImageUpload={handleImageUpload} />
            </div>
            {/* Columna derecha: Formularios */}
            <div className="lg:w-2/3 w-full flex flex-col gap-8">
               <ProfileSection
                  title="Actualizar imagen de perfil"
                  show={showImageUpload}
                  onClose={handleImageUploadClose}
               >
                  <ProfileImageUpload onClose={handleImageUploadClose} />
               </ProfileSection>
               <ProfileSection title="Información personal">
                  <ProfileForm initialData={initialData} />
               </ProfileSection>
               <ProfileSection title="Información de seguridad">
                  <SecureForm />
               </ProfileSection>
            </div>
         </div>
      </motion.div>
   );
}

export default Profile;
