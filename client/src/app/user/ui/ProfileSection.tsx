import React from 'react';
import { motion } from 'framer-motion';
import { H2 } from '@/components/semantic';

/* ------------------ Code ------------------ */

interface ProfileSectionProps {
   title: string;
   children: React.ReactNode;
   className?: string;
   show?: boolean;
   onClose?: () => void;
}

import { AnimatePresence } from 'framer-motion';

const ProfileSection: React.FC<ProfileSectionProps> = ({
   title,
   children,
   className = '',
   show = true,
   onClose,
}) => {
   return (
      <AnimatePresence>
         {show && (
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 20 }}
               transition={{ duration: 0.3 }}
               className={`bg-card p-6 rounded-md ${className}`}
               onAnimationComplete={(definition) => {
                  if (definition === 'exit' && onClose) onClose();
               }}
            >
               <H2 className="text-xl font-semibold text-primary-color mb-6 border-b border-light pb-4">
                  {title}
               </H2>
               {children}
            </motion.div>
         )}
      </AnimatePresence>
   );
};

export default ProfileSection;
