import { Modal } from '../ui/Modal';
import { ProductForm } from './ProductForm';
import type { Product, CreateProductPayload, UpdateProductPayload } from '../../types/product';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  onSubmit: (data: CreateProductPayload | UpdateProductPayload) => Promise<void>;
}

export function ProductFormModal({ isOpen, onClose, product, onSubmit }: ProductFormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Editar producto' : 'Nuevo producto'}
    >
      <ProductForm initialData={product} onSubmit={onSubmit} onCancel={onClose} />
    </Modal>
  );
}
