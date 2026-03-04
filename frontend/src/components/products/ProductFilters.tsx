import { useState, useRef, useEffect } from 'react';
import type { ProductQueryParams, FilterOptions } from '../../types/product';
import { PRODUCT_TYPE_CONFIG, PRODUCT_TYPES } from '../../constants/product';
import { FilterIcon, CloseIcon } from '../ui/Icons';
import { productsApi } from '../../api/products.api';

interface ProductFiltersProps {
  filters: ProductQueryParams;
  onFilter: (filters: Partial<ProductQueryParams>) => void;
}

export function ProductFilters({ filters, onFilter }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<FilterOptions | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const activeType = filters.tipo;
  const activeCount = [
    filters.precioMin !== undefined,
    filters.precioMax !== undefined,
    !!filters.tallaId,
    !!filters.colorId,
  ].filter(Boolean).length;

  // Load filter options on first open
  useEffect(() => {
    if (isOpen && !options) {
      productsApi.getFilterOptions().then(setOptions);
    }
  }, [isOpen, options]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const handleClearAll = () => {
    onFilter({
      tipo: undefined,
      precioMin: undefined,
      precioMax: undefined,
      tallaId: undefined,
      colorId: undefined,
    });
    setIsOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Type pills */}
      <div className="flex gap-1.5">
        <button
          onClick={() => onFilter({ tipo: undefined })}
          className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
            !activeType ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Todos
        </button>
        {PRODUCT_TYPES.map((t) => {
          const isActive = activeType === t;
          return (
            <button
              key={t}
              onClick={() => onFilter({ tipo: isActive ? undefined : t })}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                isActive ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {PRODUCT_TYPE_CONFIG[t].labelPlural}
            </button>
          );
        })}
      </div>

      {/* Advanced filter toggle */}
      <div className="relative" ref={panelRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
            isOpen || activeCount > 0
              ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
              : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <FilterIcon />
          Filtros
          {activeCount > 0 && (
            <span className="bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Filtros avanzados</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            {!options ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full" />
              </div>
            ) : (
              <>
                {/* Price range */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-500 mb-2">
                    Rango de precio
                    <span className="text-gray-400 font-normal ml-1">
                      (${options.precioMin.toFixed(0)} – ${options.precioMax.toFixed(0)})
                    </span>
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                      <input
                        type="number"
                        min={0}
                        placeholder={options.precioMin.toFixed(0)}
                        value={filters.precioMin ?? ''}
                        onChange={(e) =>
                          onFilter({ precioMin: e.target.value ? Number(e.target.value) : undefined })
                        }
                        className="w-full pl-6 pr-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <span className="text-gray-400 text-xs">–</span>
                    <div className="relative flex-1">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                      <input
                        type="number"
                        min={0}
                        placeholder={options.precioMax.toFixed(0)}
                        value={filters.precioMax ?? ''}
                        onChange={(e) =>
                          onFilter({ precioMax: e.target.value ? Number(e.target.value) : undefined })
                        }
                        className="w-full pl-6 pr-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Talla */}
                {options.tallas.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-500 mb-2">Talla</label>
                    <div className="flex flex-wrap gap-1.5">
                      {options.tallas.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => onFilter({ tallaId: filters.tallaId === t.id ? undefined : t.id })}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                            filters.tallaId === t.id
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {t.valor}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color */}
                {options.colores.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-500 mb-2">Color</label>
                    <div className="flex flex-wrap gap-1.5">
                      {options.colores.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => onFilter({ colorId: filters.colorId === c.id ? undefined : c.id })}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                            filters.colorId === c.id
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {c.nombre}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clear */}
                {activeCount > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="w-full text-center text-xs text-red-600 hover:text-red-700 font-medium py-1.5"
                  >
                    Limpiar todos los filtros
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
