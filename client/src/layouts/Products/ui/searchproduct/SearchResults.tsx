import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductInterface } from '@interfaces/Procuct.interface';
import { ProductList } from '../../index';

interface SearchResultsProps {
  listProducts: ProductInterface[];
  productSearch: ProductInterface | null;
  addImages: boolean;
  onRemoveProduct: (index: number) => void;
  onClearList: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  listProducts,
  productSearch,
  addImages,
  onRemoveProduct,
  onClearList,
}) => {
  const showResults = listProducts.length > 0;

  if (!showResults) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="multiple-results"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: 0.2 }}
      >
        <ProductList
          products={listProducts}
          showImages={addImages}
          onRemoveProduct={onRemoveProduct}
          onClearList={onClearList}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchResults;
