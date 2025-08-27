import { useState } from 'react';
import * as services from '@services/Product.services';
import { ProductInt } from '@cmm_interfaces/index';

const useProductSearch = () => {
   const [search, setSearch] = useState<string>('');
   const [productSearch, setProductSearch] = useState<ProductInt | null>(null);
   const [listProducts, setListProducts] = useState<ProductInt[]>([]);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [searchError, setSearchError] = useState<string>('');

   const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!search.trim()) return;

      setIsLoading(true);
      setSearchError('');

      try {
         const response = await services.getProduct(search.trim());
         const product = response.data.product;

         if (product) {
            setProductSearch(product);
            const exists = listProducts.some((p) => p.key === product.key);
            if (!exists) {
               setListProducts((prev) => [...prev, product]);
            }
         } else {
            setSearchError('Producto no encontrado');
            setProductSearch(null);
         }
      } catch (error) {
         setSearchError('Error al buscar el producto');
         setProductSearch(null);
      } finally {
         setIsLoading(false);
      }
   };

   const clearSearch = () => {
      setSearch('');
      setProductSearch(null);
      setListProducts([]);
      setSearchError('');
   };

   const removeProduct = (index: number) => {
      setListProducts((prev) => prev.filter((_, i) => i !== index));
   };

   const clearProductList = () => {
      setListProducts([]);
   };

   return {
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
   };
};

export default useProductSearch;
