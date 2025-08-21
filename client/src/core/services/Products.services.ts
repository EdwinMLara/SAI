import axios from '@config/axios.config';

import { ProductInterface } from '@interfaces/Procuct.interface';

/* ------------------ Code ------------------ */

export async function getProduct(
  query: Record<string, any>
): Promise<{ status: number; message: string; product: ProductInterface }> {
  const response = await axios.get('/products', { params: query });
  return {
    status: response.status,
    message: response.data.message,
    product: response.data.data?.product,
  };
}

export async function replaceAllProducts(
  products: ProductInterface[]
): Promise<{
  status: number;
  message: string;
}> {
  const response = await axios.post('/products/replaceAll', products);
  return {
    status: response.status,
    message: response.data.message,
  };
}

export async function getLastUpdate(): Promise<{
  status: number;
  message: string;
  lastUpdate: Date | null;
}> {
  const response = await axios.get('/products/lastUpdate');
  return {
    status: response.status,
    message: response.data.message,
    lastUpdate: response.data.data?.lastUpdate
      ? new Date(response.data.data.lastUpdate)
      : null,
  };
}
