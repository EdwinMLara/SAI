import React from 'react';

import {
   SearchForm,
   SearchHeader,
   SearchContainer,
   SearchResults,
   EmptyState,
   LoadingState,
   useProductSearch,
   useSearchOptions,
} from '../index';

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

   const { addImages, handleShowImages } = useSearchOptions();

   const hasResults = listProducts.length > 0 || Boolean(productSearch);
   const showEmptyState = !hasResults && !isLoading;

   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      handleSearch(e);
   };

   const handleClearAll = () => {
      clearSearch();
   };

   return (
      <div className="min-h-screen bg-background">
         <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
            <SearchHeader hasResults={hasResults} onClearAll={handleClearAll} />

            <SearchContainer>
               <SearchForm
                  search={search}
                  setSearch={setSearch}
                  isLoading={isLoading}
                  searchError={searchError}
                  addImages={addImages}
                  onSubmit={handleSubmit}
                  onShowImagesChange={handleShowImages}
               />
            </SearchContainer>

            <SearchResults
               listProducts={listProducts}
               productSearch={productSearch}
               addImages={addImages}
               onRemoveProduct={removeProduct}
               onClearList={clearProductList}
            />

            <LoadingState
               isVisible={isLoading}
               message="Estamos buscando el producto en la base de datos..."
            />

            <EmptyState
               isVisible={showEmptyState}
               message="Introduce un código de producto para comenzar la búsqueda"
            />
         </div>
      </div>
   );
};

export default SearchProduct;
