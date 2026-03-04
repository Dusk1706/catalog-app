import { ProductType } from '../../types/product';

interface ProductFiltersProps {
  activeType?: ProductType;
  onFilter: (tipo?: ProductType) => void;
}

const FILTERS: { label: string; value?: ProductType }[] = [
  { label: 'Todos' },
  { label: 'Zapatos', value: ProductType.ZAPATO },
  { label: 'Bolsas', value: ProductType.BOLSA },
];

export function ProductFilters({ activeType, onFilter }: ProductFiltersProps) {
  return (
    <div className="flex gap-2">
      {FILTERS.map(({ label, value }) => {
        const isActive = activeType === value;
        return (
          <button
            key={label}
            onClick={() => onFilter(value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              isActive
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
