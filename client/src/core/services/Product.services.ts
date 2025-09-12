import apiClient from '../config/axios.config';
import apiPaths from '../config/apiPaths.config';

import { StandardResponse, ProductInt } from '@common/interfaces';

/* ------------------ Code ------------------ */

/**
 * Creates a new product in the system.
 * @param {ProductInt} productData - Product data to create.
 * @returns {Promise<StandardResponse>} Standard backend response.
 */
export async function createProduct(
   productData: ProductInt
): Promise<StandardResponse> {
   return await apiClient.post(apiPaths.products.create, productData);
}

/**
 * Gets a specific product by key.
 * @param {string} key - The product key to retrieve.
 * @returns {Promise<StandardResponse<ProductInt>>} Standard backend response with product data.
 */
export async function getProduct(
   key: string
): Promise<StandardResponse<ProductInt>> {
   return await apiClient.get(apiPaths.products.get(key));
}

/**
 * Deletes a product from the system (admin only).
 * @param {string} key - The product key to delete.
 * @returns {Promise<StandardResponse>} Standard backend response.
 */
export async function deleteProduct(key: string): Promise<StandardResponse> {
   return await apiClient.delete(apiPaths.products.delete(key));
}

/**
 * Replaces all products in the system with new data (admin only).
 * @param {ProductInt[]} productsData - Array of products to replace all existing products.
 * @returns {Promise<StandardResponse>} Standard backend response.
 */
export async function replaceAllProducts(
   productsData: ProductInt[]
): Promise<StandardResponse> {
   return await apiClient.post(apiPaths.products.replaceAll, productsData);
}

/**
 * Gets the last update information and total products count.
 * @returns {Promise<StandardResponse<{lastUpdate: string | null, totalProducts: number}>>} Standard backend response with last update data.
 */
export async function getLastUpdate(): Promise<StandardResponse> {
   return await apiClient.get(apiPaths.products.lastUpdate);
}
