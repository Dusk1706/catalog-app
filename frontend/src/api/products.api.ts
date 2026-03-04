import apiClient from './axios';
import type {
  Product,
  ProductsResponse,
  CreateProductPayload,
  UpdateProductPayload,
  ProductQueryParams,
} from '../types/product';

export const productsApi = {
  getAll: async (params?: ProductQueryParams): Promise<ProductsResponse> => {
    const { data } = await apiClient.get<{ data: ProductsResponse }>('/products', { params });
    return data.data;
  },

  getById: async (id: number): Promise<Product> => {
    const { data } = await apiClient.get<{ data: Product }>(`/products/${id}`);
    return data.data;
  },

  create: async (payload: CreateProductPayload): Promise<Product> => {
    const { data } = await apiClient.post<{ data: Product }>('/products', payload);
    return data.data;
  },

  update: async (id: number, payload: UpdateProductPayload): Promise<Product> => {
    const { data } = await apiClient.patch<{ data: Product }>(`/products/${id}`, payload);
    return data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },
};
