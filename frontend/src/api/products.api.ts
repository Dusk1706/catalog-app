import apiClient from './axios';
import type {
  Product,
  ProductsResponse,
  CreateProductPayload,
  UpdateProductPayload,
  ProductQueryParams,
  FilterOptions,
  Color,
  Talla,
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

  getFilterOptions: async (): Promise<FilterOptions> => {
    const { data } = await apiClient.get<{ data: FilterOptions }>('/products/filter-options');
    return data.data;
  },

  uploadPhoto: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await apiClient.post<{ data: { url: string } }>('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data.url;
  },
};

export const catalogApi = {
  getColores: async (): Promise<Color[]> => {
    const { data } = await apiClient.get<{ data: Color[] }>('/catalog/colores');
    return data.data;
  },

  createColor: async (nombre: string): Promise<Color> => {
    const { data } = await apiClient.post<{ data: Color }>('/catalog/colores', { nombre });
    return data.data;
  },

  getTallas: async (): Promise<Talla[]> => {
    const { data } = await apiClient.get<{ data: Talla[] }>('/catalog/tallas');
    return data.data;
  },

  createTalla: async (valor: string): Promise<Talla> => {
    const { data } = await apiClient.post<{ data: Talla }>('/catalog/tallas', { valor });
    return data.data;
  },
};
