import { useState } from 'react';
import type { Product, CreateProductPayload, UpdateProductPayload } from '../../types/product';
import { ProductType } from '../../types/product';

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: CreateProductPayload | UpdateProductPayload) => Promise<void>;
  onCancel: () => void;
}

const EMPTY_FORM = { nombre: '', color: '', talla: '', tipo: ProductType.ZAPATO, precio: '' };

export function ProductForm({ initialData, onSubmit, onCancel }: ProductFormProps) {
  const [form, setForm] = useState({
    nombre: initialData?.nombre ?? EMPTY_FORM.nombre,
    color: initialData?.color ?? EMPTY_FORM.color,
    talla: initialData?.talla ?? EMPTY_FORM.talla,
    tipo: initialData?.tipo ?? EMPTY_FORM.tipo,
    precio: initialData?.precio?.toString() ?? EMPTY_FORM.precio,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const isBolsa = form.tipo === ProductType.BOLSA;

  const validate = () => {
    const next: typeof errors = {};
    if (!form.nombre.trim()) next.nombre = 'El nombre es obligatorio';
    if (!form.color.trim()) next.color = 'El color es obligatorio';
    if (!form.tipo) next.tipo = 'El tipo es obligatorio';
    const price = parseFloat(form.precio);
    if (!form.precio || isNaN(price) || price <= 0) next.precio = 'El precio debe ser un número positivo';
    return next;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    if (Object.keys(next).length > 0) { setErrors(next); return; }

    setSubmitting(true);
    try {
      const payload: CreateProductPayload = {
        nombre: form.nombre.trim(),
        color: form.color.trim(),
        tipo: form.tipo,
        precio: parseFloat(form.precio),
        ...(form.talla && !isBolsa && { talla: form.talla.trim() }),
      };
      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} maxLength={100}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        {errors.nombre && <p className="text-xs text-red-600 mt-1">{errors.nombre}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Color *</label>
        <input name="color" value={form.color} onChange={handleChange} maxLength={50}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        {errors.color && <p className="text-xs text-red-600 mt-1">{errors.color}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
        <select name="tipo" value={form.tipo} onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
          <option value={ProductType.ZAPATO}>Zapato</option>
          <option value={ProductType.BOLSA}>Bolsa</option>
        </select>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-1 ${isBolsa ? 'text-gray-400' : 'text-gray-700'}`}>
          Talla {isBolsa && <span className="text-xs font-normal">(no aplica para bolsas)</span>}
        </label>
        <input name="talla" value={form.talla ?? ''} onChange={handleChange} maxLength={20}
          disabled={isBolsa}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
        <input name="precio" type="number" step="0.01" min="0.01" value={form.precio} onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        {errors.precio && <p className="text-xs text-red-600 mt-1">{errors.precio}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          Cancelar
        </button>
        <button type="submit" disabled={submitting}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors">
          {submitting ? 'Guardando…' : initialData ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
}
