import React from 'react';
import { motion } from 'framer-motion';

import { Button, Icon } from '@ui/index.ui';

import { SearchForm, ProductList, ProductDetail } from './ui';
import { useProductSearch, useSearchOptions } from '@/layouts/Products/hooks';

const SearchProduct = () => {
  const {
    search,
    setSearch,
    productSearch,
    listProducts,
    isLoading,
    searchError,
    handleSearch,
    clearSearch,
    removeProduct,
    clearProductList,
  } = useProductSearch();

  const { addImages, multiSearch, handleShowImages, handleMultiSearch } =
    useSearchOptions();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleSearch(e, multiSearch);
  };

  const onMultiSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleMultiSearch(e, clearProductList);
  };

  const hasResults = listProducts.length > 0 || productSearch;

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary-color">
              Buscar Productos
            </h1>
          </div>
        </div>

        {hasResults && (
          <Button
            variant="ghost"
            onClick={clearSearch}
            className="flex items-center gap-2"
          >
            <Icon name="FaTrash" size={16} />
            Limpiar búsquedas
          </Button>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-md shadow-medium border border-light p-6"
      >
        <SearchForm
          search={search}
          setSearch={setSearch}
          isLoading={isLoading}
          searchError={searchError}
          multiSearch={multiSearch}
          addImages={addImages}
          onSubmit={onSubmit}
          onMultiSearchChange={onMultiSearchChange}
          onShowImagesChange={handleShowImages}
        />
      </motion.div>

      {listProducts.length > 0 && multiSearch && (
        <ProductList
          products={listProducts}
          showImages={addImages}
          onRemoveProduct={removeProduct}
          onClearList={clearProductList}
        />
      )}

      {productSearch && !multiSearch && (
        <ProductDetail product={productSearch} showImages={addImages} />
      )}
    </div>
  );
};

export default SearchProduct;
