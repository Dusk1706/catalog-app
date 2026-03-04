import { useState, useEffect, useCallback, useTransition } from 'react';
import { productsApi } from '../api/products.api';
import type {
  Product,
  ProductQueryParams,
  ProductsResponse,
  CreateProductPayload,
  UpdateProductPayload,
} from '../types/product';

const INITIAL_FILTERS: ProductQueryParams = { page: 1, limit: 10 };

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<ProductsResponse['meta'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductQueryParams>(INITIAL_FILTERS);
  const [isPending, startTransition] = useTransition();

  const fetchProducts = useCallback(async () => {
    setError(null);
    try {
      const response = await productsApi.getAll(filters);
      setProducts(response.data);
      setMeta(response.meta);
    } catch {
      setError('Error al cargar los productos');
    }
  }, [filters]);

  useEffect(() => {
    startTransition(async () => {
      await fetchProducts();
    });
  }, [fetchProducts]);

  const createProduct = useCallback(async (payload: CreateProductPayload) => {
    await productsApi.create(payload);
    startTransition(async () => {
      const response = await productsApi.getAll(INITIAL_FILTERS);
      setProducts(response.data);
      setMeta(response.meta);
      setFilters(INITIAL_FILTERS);
    });
  }, []);

  const updateProduct = useCallback(
    async (id: number, payload: UpdateProductPayload) => {
      await productsApi.update(id, payload);
      startTransition(async () => {
        await fetchProducts();
      });
    },
    [fetchProducts],
  );

  const deleteProduct = useCallback(
    async (id: number) => {
      await productsApi.delete(id);
      startTransition(async () => {
        await fetchProducts();
      });
    },
    [fetchProducts],
  );

  const updateFilters = useCallback((newFilters: Partial<ProductQueryParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const changePage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  return {
    products,
    meta,
    isPending,
    error,
    filters,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    updateFilters,
    changePage,
  };
}
