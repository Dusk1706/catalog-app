import { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsApi } from '../api/products.api';
import type { Product, UpdateProductPayload } from '../types/product';
import { ProductType } from '../types/product';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { BACKEND_URL } from '../config';
import { formatPrice, formatDate } from '../utils/format';
import { getTypeConfig } from '../constants/product';
import { ChevronLeftIcon, EditIcon, TrashIcon } from '../components/ui/Icons';
import { ProductTypeBadge } from '../components/products/ProductTypeBadge';

const ProductFormModal = lazy(() =>
  import('../components/products/ProductFormModal').then((m) => ({ default: m.ProductFormModal })),
);

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadProduct = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await productsApi.getById(Number(id));
      setProduct(data);
    } catch {
      setError('No se pudo cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleUpdate = async (data: UpdateProductPayload) => {
    if (!product) return;
    await productsApi.update(product.id, data);
    await loadProduct();
    setIsEditOpen(false);
  };

  const handleDelete = async () => {
    if (!product) return;
    setDeleting(true);
    try {
      await productsApi.delete(product.id);
      navigate('/');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-4">{error ?? 'Producto no encontrado'}</p>
          <button onClick={() => navigate('/')} className="text-indigo-600 hover:underline text-sm">
            ← Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  const isZapato = product.tipo === ProductType.ZAPATO;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeftIcon />
            Catálogo
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-900 font-medium truncate">{product.nombre}</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left — photo */}
            <div className="bg-gray-100 border-b md:border-b-0 md:border-r border-gray-200 flex items-center justify-center min-h-80 p-6">
              {product.foto ? (
                <img
                  src={`${BACKEND_URL}${product.foto}`}
                  alt={product.nombre}
                  className="max-h-96 max-w-full object-contain rounded-xl"
                />
              ) : (
                <div className="text-center text-gray-300">
                  <span className="text-8xl block mb-3">{getTypeConfig(product.tipo).emoji}</span>
                  <p className="text-sm text-gray-400">Sin foto</p>
                </div>
              )}
            </div>

            {/* Right — details */}
            <div className="p-6 flex flex-col gap-5">
              <div>
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900 leading-tight">{product.nombre}</h1>
                  <ProductTypeBadge tipo={product.tipo} showEmoji size="md" />
                </div>
                <p className="text-3xl font-bold text-indigo-600">{formatPrice(product.precio)}</p>
              </div>

              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div>
                  <dt className="text-gray-500 font-medium">Color</dt>
                  <dd className="text-gray-900 mt-0.5">{product.color.nombre}</dd>
                </div>
                {isZapato && (
                  <div>
                    <dt className="text-gray-500 font-medium">Talla</dt>
                    <dd className="text-gray-900 mt-0.5">{product.talla?.valor ?? '—'}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-gray-500 font-medium">ID</dt>
                  <dd className="text-gray-400 mt-0.5 font-mono text-xs">#{product.id}</dd>
                </div>
                <div>
                  <dt className="text-gray-500 font-medium">Creado</dt>
                  <dd className="text-gray-600 mt-0.5 text-xs">{formatDate(product.createdAt)}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-gray-500 font-medium">Última actualización</dt>
                  <dd className="text-gray-600 mt-0.5 text-xs">{formatDate(product.updatedAt)}</dd>
                </div>
              </dl>

              {product.descripcion ? (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Descripción</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{product.descripcion}</p>
                </div>
              ) : null}

              <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  <EditIcon />
                  Editar
                </button>
                <button
                  onClick={() => setIsDeleteOpen(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 text-sm font-medium rounded-xl hover:bg-red-100 transition-colors"
                >
                  <TrashIcon />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {isEditOpen && (
        <Suspense fallback={<LoadingSpinner />}>
          <ProductFormModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            product={product}
            onSubmit={handleUpdate}
          />
        </Suspense>
      )}

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar producto"
        message={`¿Seguro que deseas eliminar "${product.nombre}"? Esta acción no se puede deshacer.`}
      />

      {deleting && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}
