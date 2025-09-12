import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/Auth.context';
import { UserChangesInt } from '@common/interfaces';
import {
   ProfileHeader,
   ProfileSection,
   ProfileForm,
   PasswordChangeForm,
   ProfileImageUpload,
} from '../ui';

const Profile = () => {
   const { user } = useAuth();
   const [showImageUpload, setShowImageUpload] = useState(false);

   if (!user) {
      return (
         <div className="flex items-center justify-center min-h-96">
            <p className="text-secondary-color">Cargando perfil...</p>
         </div>
      );
   }

   const handleImageUpload = () => {
      setShowImageUpload(true);
   };

   const handleImageUploadClose = () => {
      setShowImageUpload(false);
   };

   const initialFormData: Partial<UserChangesInt> = {
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
   };

   return (
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.5 }}
         className="container mx-auto px-4 py-8 max-w-4xl"
      >
         <div className="space-y-8">
            <ProfileHeader user={user} onImageUpload={handleImageUpload} />

            <ProfileImageUpload
               isVisible={showImageUpload}
               onClose={handleImageUploadClose}
            />

            <ProfileSection title="Información personal">
               <ProfileForm initialData={initialFormData} />
            </ProfileSection>

            <ProfileSection title="Cambiar contraseña">
               <PasswordChangeForm />
            </ProfileSection>
         </div>
      </motion.div>
   );
};

export default Profile;
