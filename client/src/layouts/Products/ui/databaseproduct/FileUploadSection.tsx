import React from 'react';
import { motion } from 'framer-motion';
import { InputFile, Message } from '@ui/index.ui';

interface FileUploadSectionProps {
   onFileChange: (file: File | null) => void;
   onFileContinue: () => void;
   isProcessing: boolean;
   uploadSuccess: boolean;
   totalRows: number;
   resetKey: number;
   error: string | null;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
   onFileChange,
   onFileContinue,
   isProcessing,
   uploadSuccess,
   totalRows,
   resetKey,
   error,
}) => {
   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
         className="bg-card p-6 border border-light rounded-md"
      >
         <div className="max-w-md mx-auto">
            <InputFile
               accept=".xlsx,.xls"
               onChange={onFileChange}
               onContinue={onFileContinue}
               disabled={isProcessing || uploadSuccess || totalRows > 0}
               resetKey={resetKey}
               helperText="Solo archivos Excel (.xlsx, .xls)"
            />
         </div>

         {error && (
            <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.3 }}
               className="mt-4"
            >
               <Message type="error" message={error} show={!!error} />
            </motion.div>
         )}
      </motion.div>
   );
};

export default FileUploadSection;
