import React from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/Icon';

interface ProfileHeaderProps {
   user: {
      image?: string;
      name: string;
      email: string;
      role: string;
   };
   onImageUpload: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
   user,
   onImageUpload,
}) => {
   return (
      <motion.div
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ duration: 0.3 }}
         className="bg-card p-8 text-center"
      >
         <div className="relative inline-block mb-6">
            <div className="w-24 h-24 rounded-full bg-tertiary flex items-center justify-center overflow-hidden">
               {user.image ? (
                  <img
                     src={user.image}
                     alt="Profile"
                     className="w-full h-full object-cover"
                  />
               ) : (
                  <Icon
                     name="FaUser"
                     size="32"
                     className="text-secondary-color"
                  />
               )}
            </div>
            <button
               onClick={onImageUpload}
               className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center hover:bg-brand-600 transition-colors"
            >
               <Icon name="FaCamera" size="16" />
            </button>
         </div>
         <h1 className="text-2xl font-bold text-primary-color mb-2">
            {user.name}
         </h1>
         <p className="text-secondary-color mb-1">{user.email}</p>
         <span className="inline-block px-3 py-1 bg-brand-light text-brand rounded-full text-sm font-medium">
            {user.role === 'admin'
               ? 'Administrador'
               : user.role === 'user'
                 ? 'Usuario'
                 : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
         </span>
      </motion.div>
   );
};

export default ProfileHeader;
