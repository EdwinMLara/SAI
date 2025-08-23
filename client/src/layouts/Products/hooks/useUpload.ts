import { useState } from 'react';
import { ProductInterface } from '@interfaces/Procuct.interface';
import * as services from '@services/Products.services';

interface UseUploadReturn {
   isUploading: boolean;
   uploadSuccess: boolean;
   uploadProducts: (products: ProductInterface[]) => Promise<void>;
   resetUpload: () => void;
}

const useUpload = (onSuccess?: () => void): UseUploadReturn => {
   const [isUploading, setIsUploading] = useState<boolean>(false);
   const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

   const uploadProducts = async (products: ProductInterface[]) => {
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
