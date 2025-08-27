import { useState } from 'react';
import { ProductInt } from '@cmm_interfaces/index';
import * as services from '@services/Product.services';

interface UseUploadReturn {
   isUploading: boolean;
   uploadSuccess: boolean;
   uploadProducts: (products: ProductInt[]) => Promise<void>;
   resetUpload: () => void;
}

const useUpload = (onSuccess?: () => void): UseUploadReturn => {
   const [isUploading, setIsUploading] = useState<boolean>(false);
   const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

   const uploadProducts = async (products: ProductInt[]) => {
      setIsUploading(true);
      try {
         await services.replaceAllProducts(products);
         setUploadSuccess(true);
         onSuccess?.();
      } catch (error) {
         console.error('Error al subir productos:', error);
         throw error;
      } finally {
         setIsUploading(false);
      }
   };

   const resetUpload = () => {
      setUploadSuccess(false);
   };

   return {
      isUploading,
      uploadSuccess,
      uploadProducts,
      resetUpload,
   };
};

export default useUpload;
