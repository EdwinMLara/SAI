import React from 'react';
import { motion } from 'framer-motion';

interface ProfileSectionProps {
   title: string;
   children: React.ReactNode;
   className?: string;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
   title,
   children,
   className = '',
}) => {
   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.3 }}
         className={`bg-card p-6 rounded-md ${className}`}
      >
         <h2 className="text-xl font-semibold text-primary-color mb-6 border-b border-light pb-3">
            {title}
         </h2>
         {children}
      </motion.div>
   );
};

export default ProfileSection;
