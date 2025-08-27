import React, { useState } from 'react';
import { Loading } from '@ui/index.ui';
import { H1 } from '@components/semantic';
import {
   useProcessFile,
   useLastUpdate,
   useUpload,
   ProcessingSummary,
   ProductPreviewTable,
   ErrorList,
   UploadActions,
   LastUpdateInfo,
   FileUploadSection,
} from '../';
import { ProductInt } from '@cmm_interfaces/index';

const DatabaseProduct = () => {
   const { processedData, isProcessing, error, processFile, resetData } =
      useProcessFile();
   const {
      lastUpdate,
      isLoading: isLoadingUpdate,
      formatDate,
      refetch,
   } = useLastUpdate();
   const { isUploading, uploadSuccess, uploadProducts, resetUpload } =
      useUpload(refetch);

   const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const [resetKey, setResetKey] = useState(0);

   const handleFileChange = (file: File | null) => {
      setSelectedFile(file);
      resetUpload();
   };

   const handleFileContinue = () => {
      if (selectedFile && !isProcessing) {
         processFile(selectedFile);
      }
   };

   const handleUpload = async () => {
      try {
         await uploadProducts(processedData.validProducts);
      } catch (error) {
         console.error('Error en la subida:', error);
      }
   };

   const handleReset = () => {
      setSelectedFile(null);
      resetUpload();
      setResetKey((k) => k + 1);
      resetData();
   };

   const renderProcessingResults = () => {
      if (isProcessing) {
         return <Loading message="Procesando archivo..." />;
      }

      if (processedData.totalRows === 0) return null;

      return (
         <div className="mt-6 space-y-4">
            <div className="bg-card p-6 border border-light rounded-md">
               <h3 className="text-lg font-semibold text-primary-color mb-4">
                  Resultados del procesamiento
               </h3>

               <ProcessingSummary
                  totalRows={processedData.totalRows}
                  validProducts={processedData.validProducts.length}
                  invalidRows={processedData.invalidRows.length}
               />

               {processedData.validProducts.length > 0 && (
                  <ProductPreviewTable products={processedData.validProducts} />
               )}

               <ErrorList invalidRows={processedData.invalidRows} />

               <UploadActions
                  validProductsCount={processedData.validProducts.length}
                  isUploading={isUploading}
                  uploadSuccess={uploadSuccess}
                  onUpload={handleUpload}
                  onReset={handleReset}
               />
            </div>
         </div>
      );
   };

   return (
      <div className="space-y-6">
         <H1>Actualizar base de datos</H1>

         <FileUploadSection
            onFileChange={handleFileChange}
            onFileContinue={handleFileContinue}
            isProcessing={isProcessing}
            uploadSuccess={uploadSuccess}
            totalRows={processedData.totalRows}
            resetKey={resetKey}
            error={error}
         />

         {renderProcessingResults()}

         <LastUpdateInfo
            lastUpdate={lastUpdate}
            isLoading={isLoadingUpdate}
            formatDate={formatDate}
         />
      </div>
   );
};

export default DatabaseProduct;
