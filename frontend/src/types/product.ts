export enum ProductType {
  ZAPATO = 'ZAPATO',
  BOLSA = 'BOLSA',
}

export interface Product {
  id: number;
  nombre: string;
  color: string;
  talla: string | null;
  tipo: ProductType;
  precio: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductPayload {
  nombre: string;
  color: string;
  talla?: string;
  tipo: ProductType;
  precio: number;
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {}

export interface ProductsResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProductQueryParams {
  search?: string;
  tipo?: ProductType;
  page?: number;
  limit?: number;
}
