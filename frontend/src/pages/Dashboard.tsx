import { useState, lazy, Suspense } from 'react';
import { useProducts } from '../hooks/useProducts';
import { SearchBar } from '../components/ui/SearchBar';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Pagination } from '../components/ui/Pagination';
import { ProductFilters } from '../components/products/ProductFilters';
import { ProductTable } from '../components/products/ProductTable';
import { PlusIcon } from '../components/ui/Icons';
import type { Product, CreateProductPayload, UpdateProductPayload, ProductQueryParams } from '../types/product';

const ProductFormModal = lazy(() =>
  import('../components/products/ProductFormModal').then((m) => ({ default: m.ProductFormModal })),
);

export function Dashboard() {
  const {
    products,
    meta,
    isPending,
    error,
    filters,
    createProduct,
    updateProduct,
    deleteProduct,
    updateFilters,
    changePage,
  } = useProducts();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const handleSearch = (search: string) => {
    updateFilters({ search: search || undefined });
  };

  const handleFilter = (newFilters: Partial<ProductQueryParams>) => {
    updateFilters(newFilters);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormModalOpen(true);
  };

  const handleCreate = () => {
    setEditingProduct(undefined);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (data: CreateProductPayload | UpdateProductPayload) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, data);
    } else {
      await createProduct(data as CreateProductPayload);
    }
    setIsFormModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (deletingProduct) {
      await deleteProduct(deletingProduct.id);
      setDeletingProduct(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Catálogo de Productos</h1>
            <p className="text-xs text-gray-500">Zapatería y Bolsas</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon />
            Nuevo Producto
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} />
          </div>
          <ProductFilters filters={filters} onFilter={handleFilter} />
        </div>

        {isPending ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="rounded-xl bg-red-50 border border-red-200 px-6 py-8 text-center">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        ) : products.length > 0 ? (
          <>
            <ProductTable products={products} onEdit={handleEdit} onDelete={setDeletingProduct} />
            {meta && (
              <Pagination
                page={meta.page}
                totalPages={meta.totalPages}
                total={meta.total}
                limit={meta.limit}
                onPageChange={changePage}
              />
            )}
          </>
        ) : (
          <div className="rounded-xl bg-white border border-gray-200 px-6 py-16 text-center">
            <p className="text-4xl mb-3">🛍️</p>
            <p className="text-gray-500 font-medium">No se encontraron productos</p>
            <p className="text-sm text-gray-400 mt-1">Intenta cambiar los filtros o crea uno nuevo</p>
          </div>
        )}
      </main>

      {isFormModalOpen && (
        <Suspense fallback={<LoadingSpinner />}>
          <ProductFormModal
            isOpen={isFormModalOpen}
            onClose={() => setIsFormModalOpen(false)}
            product={editingProduct}
            onSubmit={handleFormSubmit}
          />
        </Suspense>
      )}

      <ConfirmDialog
        isOpen={deletingProduct !== null}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar producto"
        message={`¿Seguro que deseas eliminar "${deletingProduct?.nombre}"?`}
      />
    </div>
  );
}
