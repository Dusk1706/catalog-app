export enum ProductType {
  ZAPATO = 'ZAPATO',
  BOLSA = 'BOLSA',
}

export interface Color {
  id: number;
  nombre: string;
}

export interface Talla {
  id: number;
  valor: string;
}

export interface Product {
  id: number;
  nombre: string;
  colorId: number;
  color: Color;
  tallaId: number | null;
  talla: Talla | null;
  tipo: ProductType;
  precio: number;
  foto: string | null;
  descripcion: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductPayload {
  nombre: string;
  colorId: number;
  tallaId?: number;
  tipo: ProductType;
  precio: number;
  foto?: string;
  descripcion?: string;
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

export interface FilterOptions {
  colores: Color[];
  tallas: Talla[];
  precioMin: number;
  precioMax: number;
}

export interface ProductQueryParams {
  search?: string;
  tipo?: ProductType;
  precioMin?: number;
  precioMax?: number;
  tallaId?: number;
  colorId?: number;
  page?: number;
  limit?: number;
}
