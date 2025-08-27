import apiClient from '../config/axios.config';
import apiPaths from '../config/apiPaths.config';

import { StandardResponse } from '@common/interfaces';

/**
 * Gets the list of products.
 * @returns {Promise<StandardResponse>} Standard backend response.
 */
export async function getProduct(search: String): Promise<StandardResponse> {
   return await apiClient.get(apiPaths.products.base, { key: search });
}

/**
 * Replaces all existing products with a new list.
 * @param {any} data - New list of products.
 * @returns {Promise<StandardResponse>} Standard backend response.
 */
export async function replaceAllProducts(data: any): Promise<StandardResponse> {
   return await apiClient.post(apiPaths.products.replaceAll, data);
}

/**
 * Creates a new product.
 * @param {any} data - New product data.
 * @returns {Promise<StandardResponse>} Standard backend response.
 */
export async function createProduct(data: any): Promise<StandardResponse> {
   return await apiClient.post(apiPaths.products.base, data);
}

/**
 * Updates an existing product.
 * @param {string} id - ID of the product to update.
 * @param {any} data - Updated product data.
 * @returns {Promise<StandardResponse>} Standard backend response.
 */
export async function updateProduct(
   id: string,
   data: any
): Promise<StandardResponse> {
   return await apiClient.put(`${apiPaths.products.base}/${id}`, data);
}

/**
 * Deletes a product by ID.
 * @param {string} id - ID of the product to delete.
 * @returns {Promise<StandardResponse>} Standard backend response.
 */
export async function deleteProduct(id: string): Promise<StandardResponse> {
   return await apiClient.delete(`${apiPaths.products.base}/${id}`);
}
