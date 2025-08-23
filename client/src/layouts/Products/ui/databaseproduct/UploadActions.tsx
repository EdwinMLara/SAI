import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@ui/index.ui';

interface UploadActionsProps {
   validProductsCount: number;
   isUploading: boolean;
   uploadSuccess: boolean;
   onUpload: () => void;
   onReset: () => void;
}

const UploadActions: React.FC<UploadActionsProps> = ({
   validProductsCount,
   isUploading,
   uploadSuccess,
   onUpload,
   onReset,
}) => {
   const isUploadDisabled =
      validProductsCount === 0 || isUploading || uploadSuccess;

   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
         className="flex flex-col sm:flex-row justify-center gap-4"
      >
         <Button
            type="button"
            variant="primary"
            onClick={onUpload}
            disabled={isUploadDisabled}
            className="flex items-center justify-center space-x-2"
         >
            {isUploading ? (
               <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Subiendo...</span>
               </>
            ) : uploadSuccess ? (
               <>
                  <svg
                     className="w-4 h-4"
                     fill="currentColor"
                     viewBox="0 0 20 20"
                  >
                     <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                     />
                  </svg>
                  <span>Subido exitosamente</span>
               </>
            ) : (
               <span>Subir productos ({validProductsCount})</span>
            )}
         </Button>

         <Button type="button" variant="secondary" onClick={onReset}>
            Cargar otro archivo
         </Button>
      </motion.div>
   );
};

export default UploadActions;
