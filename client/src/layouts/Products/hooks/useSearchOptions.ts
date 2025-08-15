import { useState } from 'react';

const useSearchOptions = () => {
  const [addImages, setAddImages] = useState<boolean>(false);
  const [multiSearch, setMultiSearch] = useState<boolean>(true);

  const handleShowImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddImages(e.target.checked);
  };

  const handleMultiSearch = (
    e: React.ChangeEvent<HTMLInputElement>,
    clearList: () => void
  ) => {
    setMultiSearch(e.target.checked);
    if (!e.target.checked) {
      clearList();
    }
  };

  return {
    addImages,
    multiSearch,
    handleShowImages,
    handleMultiSearch,
  };
};

export default useSearchOptions;
