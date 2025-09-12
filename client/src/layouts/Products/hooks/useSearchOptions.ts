import { useState } from 'react';

const useSearchOptions = () => {
   const [addImages, setAddImages] = useState<boolean>(false);

   const handleShowImages = (e: React.ChangeEvent<HTMLInputElement>) => {
      setAddImages(e.target.checked);
   };

   return {
      addImages,
      handleShowImages,
   };
};

export default useSearchOptions;
