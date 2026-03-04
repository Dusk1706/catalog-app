import { ProductType } from '../types/product';

export interface ProductTypeConfig {
  label: string;
  labelPlural: string;
  emoji: string;
  badgeClass: string;
}

export const PRODUCT_TYPE_CONFIG: Record<ProductType, ProductTypeConfig> = {
  [ProductType.ZAPATO]: {
    label: 'Zapato',
    labelPlural: 'Zapatos',
    emoji: '👟',
    badgeClass: 'bg-blue-100 text-blue-700',
  },
  [ProductType.BOLSA]: {
    label: 'Bolsa',
    labelPlural: 'Bolsas',
    emoji: '👜',
    badgeClass: 'bg-purple-100 text-purple-700',
  },
};

/** Get config for a given product type, with safe fallback */
export function getTypeConfig(tipo: ProductType): ProductTypeConfig {
  return (
    PRODUCT_TYPE_CONFIG[tipo] ?? {
      label: tipo,
      labelPlural: tipo,
      emoji: '📦',
      badgeClass: 'bg-gray-100 text-gray-700',
    }
  );
}

/** All product types as an ordered array (useful for selects / radio groups) */
export const PRODUCT_TYPES = Object.keys(PRODUCT_TYPE_CONFIG) as ProductType[];
