import { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types/product';
import { ProductType } from '../../types/product';
import { formatPrice } from '../../utils/format';
import { EditIcon, TrashIcon } from '../ui/Icons';
import { ProductTypeBadge } from './ProductTypeBadge';
import { ProductThumbnail } from './ProductThumbnail';

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

const ProductRow = memo(function ProductRow({ product, onEdit, onDelete }: ProductRowProps) {
  const navigate = useNavigate();
  const isZapato = product.tipo === ProductType.ZAPATO;

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-3 py-2 w-14">
        <ProductThumbnail
          foto={product.foto}
          tipo={product.tipo}
          nombre={product.nombre}
          onClick={() => navigate(`/products/${product.id}`)}
        />
      </td>
      {/* Nombre */}
      <td className="px-4 py-3 text-sm">
        <button
          onClick={() => navigate(`/products/${product.id}`)}
          className="font-medium text-gray-900 hover:text-indigo-600 transition-colors text-left"
        >
          {product.nombre}
        </button>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{product.color.nombre}</td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {isZapato ? (product.talla?.valor ?? '—') : <span className="text-gray-400 italic text-xs">N/A</span>}
      </td>
      <td className="px-4 py-3">
        <ProductTypeBadge tipo={product.tipo} />
      </td>
      <td className="px-4 py-3 text-sm font-medium text-gray-800">{formatPrice(product.precio)}</td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
            title="Editar"
          >
            <EditIcon />
          </button>
          <button
            onClick={() => onDelete(product)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Eliminar"
          >
            <TrashIcon />
          </button>
        </div>
      </td>
    </tr>
  );
});

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  // rerender-memo: avoid creating a new sorted array on every parent re-render
  const sorted = useMemo(() => products.toSorted((a, b) => b.id - a.id), [products]);

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full text-left">
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 border-b border-gray-200">
          <tr>
            <th className="px-3 py-3 w-14"></th>
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3">Color</th>
            <th className="px-4 py-3">Talla</th>
            <th className="px-4 py-3">Tipo</th>
            <th className="px-4 py-3">Precio</th>
            <th className="px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sorted.map((product) => (
            <ProductRow key={product.id} product={product} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
