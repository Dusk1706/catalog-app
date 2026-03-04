import { memo } from 'react';
import type { Product } from '../../types/product';
import { ProductType } from '../../types/product';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

interface ProductRowProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const formatPrice = (precio: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(precio);

const ProductRow = memo(function ProductRow({ product, onEdit, onDelete }: ProductRowProps) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-sm text-gray-800">{product.nombre}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{product.color}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{product.talla ?? '—'}</td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
            product.tipo === ProductType.ZAPATO
              ? 'bg-blue-100 text-blue-700'
              : 'bg-purple-100 text-purple-700'
          }`}
        >
          {product.tipo}
        </span>
      </td>
      <td className="px-4 py-3 text-sm font-medium text-gray-800">{formatPrice(product.precio)}</td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
            title="Editar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(product)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Eliminar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
});

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full text-left">
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3">Color</th>
            <th className="px-4 py-3">Talla</th>
            <th className="px-4 py-3">Tipo</th>
            <th className="px-4 py-3">Precio</th>
            <th className="px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.toSorted((a, b) => b.id - a.id).map((product) => (
            <ProductRow key={product.id} product={product} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
