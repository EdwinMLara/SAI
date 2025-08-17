import { useState } from 'react';
import * as services from '@services/Products.services';
import { ProductInterface } from '@interfaces/Procuct.interface';

const useProductSearch = () => {
  const [search, setSearch] = useState<string>('');
  const [productSearch, setProductSearch] = useState<ProductInterface | null>(
    null
  );
  const [listProducts, setListProducts] = useState<ProductInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string>('');

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!search.trim()) return;

    setIsLoading(true);
    setSearchError('');

    try {
      const response = await services.getProduct({ key: search.trim() });
      if (response.product) {
        setProductSearch(response.product);
        const exists = listProducts.some((p) => p.key === response.product.key);
        if (!exists) {
          setListProducts((prev) => [...prev, response.product]);
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
