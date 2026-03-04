import { useState, useRef, useEffect } from 'react';
import type { Product, CreateProductPayload, UpdateProductPayload, Color, Talla } from '../../types/product';
import { ProductType } from '../../types/product';
import { productsApi, catalogApi } from '../../api/products.api';
import { BACKEND_URL } from '../../config';
import { PRODUCT_TYPES, getTypeConfig } from '../../constants/product';
import { CloseCircleIcon, ImageIcon } from '../ui/Icons';

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: CreateProductPayload | UpdateProductPayload) => Promise<void>;
  onCancel: () => void;
}

const EMPTY_FORM = {
  nombre: '',
  colorId: '' as string | number,
  tallaId: '' as string | number,
  tipo: ProductType.ZAPATO,
  precio: '',
  foto: '',
  descripcion: '',
};

export function ProductForm({ initialData, onSubmit, onCancel }: ProductFormProps) {
  const [colores, setColores] = useState<Color[]>([]);
  const [tallas, setTallas] = useState<Talla[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);

  const [form, setForm] = useState({
    nombre: initialData?.nombre ?? EMPTY_FORM.nombre,
    colorId: initialData?.colorId ?? EMPTY_FORM.colorId,
    tallaId: initialData?.tallaId ?? EMPTY_FORM.tallaId,
    tipo: initialData?.tipo ?? EMPTY_FORM.tipo,
    precio: initialData?.precio?.toString() ?? EMPTY_FORM.precio,
    foto: initialData?.foto ?? EMPTY_FORM.foto,
    descripcion: initialData?.descripcion ?? EMPTY_FORM.descripcion,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>(
    initialData?.foto ? `${BACKEND_URL}${initialData.foto}` : '',
  );
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isZapato = form.tipo === ProductType.ZAPATO;

  useEffect(() => {
    Promise.all([catalogApi.getColores(), catalogApi.getTallas()])
      .then(([c, t]) => { setColores(c); setTallas(t); })
      .finally(() => setLoadingCatalog(false));
  }, []);

  const validate = () => {
    const next: typeof errors = {};
    if (!form.nombre.trim()) next.nombre = 'El nombre es obligatorio';
    if (!form.colorId) next.colorId = 'El color es obligatorio';
    if (!form.tipo) next.tipo = 'El tipo es obligatorio';
    const price = parseFloat(form.precio);
    if (!form.precio || isNaN(price) || price <= 0)
      next.precio = 'El precio debe ser un número positivo';
    return next;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === 'tipo' && value === ProductType.BOLSA) {
      setForm((prev) => ({ ...prev, tipo: value as ProductType, tallaId: '' }));
    } else if (name === 'colorId' || name === 'tallaId') {
      setForm((prev) => ({ ...prev, [name]: value ? Number(value) : '' }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileSelect = async (file: File) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setPhotoPreview(preview);
    setUploadingPhoto(true);
    try {
      const url = await productsApi.uploadPhoto(file);
      setForm((prev) => ({ ...prev, foto: url }));
    } catch {
      setErrors((prev) => ({ ...prev, foto: 'Error al subir la imagen' }));
      setPhotoPreview('');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) handleFileSelect(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    if (Object.keys(next).length > 0) { setErrors(next); return; }
    setSubmitting(true);
    try {
      const payload: CreateProductPayload = {
        nombre: form.nombre.trim(),
        colorId: Number(form.colorId),
        tipo: form.tipo,
        precio: parseFloat(form.precio),
        ...(isZapato && form.tallaId && { tallaId: Number(form.tallaId) }),
        ...(form.foto && { foto: form.foto }),
        ...(form.descripcion.trim() && { descripcion: form.descripcion.trim() }),
      };
      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
      {/* Foto */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Foto del producto</label>
        <div
          className={`relative border-2 border-dashed rounded-xl transition-colors cursor-pointer ${
            dragOver ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {photoPreview ? (
            <div className="relative">
              <img
                src={photoPreview}
                alt="Preview"
                className="w-full h-48 object-contain rounded-xl bg-gray-50"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPhotoPreview('');
                  setForm((prev) => ({ ...prev, foto: '' }));
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-50 transition-colors"
              >
                <CloseCircleIcon />
              </button>
              {uploadingPhoto && (
                <div className="absolute inset-0 bg-white/70 rounded-xl flex items-center justify-center">
                  <div className="animate-spin h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full" />
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center">
              {uploadingPhoto ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full" />
                  <span className="text-xs text-gray-500">Subiendo imagen…</span>
                </div>
              ) : (
                <>
                  <ImageIcon />
                  <p className="text-sm text-gray-500">Arrastra o <span className="text-indigo-600 font-medium">selecciona una imagen</span></p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP · Máx. 5 MB</p>
                </>
              )}
            </div>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileInputChange} />
        {errors.foto && <p className="text-xs text-red-600 mt-1">{errors.foto}</p>}
      </div>

      {/* Tipo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
        <div className="grid grid-cols-2 gap-2">
          {PRODUCT_TYPES.map((t) => (
            <label
              key={t}
              className={`flex items-center gap-2 border rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${
                form.tipo === t
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-300 hover:border-gray-400 text-gray-700'
              }`}
            >
              <input type="radio" name="tipo" value={t} checked={form.tipo === t} onChange={handleChange} className="hidden" />
              <span className="text-lg">{getTypeConfig(t).emoji}</span>
              <span className="text-sm font-medium">{getTypeConfig(t).label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} maxLength={100}
          placeholder="Ej. Tenis Air Max"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        {errors.nombre && <p className="text-xs text-red-600 mt-1">{errors.nombre}</p>}
      </div>

      {/* Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Color *</label>
        <select name="colorId" value={form.colorId} onChange={handleChange}
          disabled={loadingCatalog}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
          <option value="">Selecciona un color</option>
          {colores.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
        {errors.colorId && <p className="text-xs text-red-600 mt-1">{errors.colorId}</p>}
      </div>

      {/* Talla — solo para ZAPATO */}
      {isZapato && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Talla</label>
          <select name="tallaId" value={form.tallaId ?? ''} onChange={handleChange}
            disabled={loadingCatalog}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
            <option value="">Sin talla</option>
            {tallas.map((t) => (
              <option key={t.id} value={t.id}>{t.valor}</option>
            ))}
          </select>
        </div>
      )}

      {/* Precio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
          <input name="precio" type="number" step="0.01" min="0.01" value={form.precio} onChange={handleChange}
            placeholder="0.00"
            className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        {errors.precio && <p className="text-xs text-red-600 mt-1">{errors.precio}</p>}
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea name="descripcion" value={form.descripcion ?? ''} onChange={handleChange}
          maxLength={500} rows={3} placeholder="Descripción opcional del producto…"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
        <p className="text-xs text-gray-400 text-right mt-0.5">{(form.descripcion ?? '').length}/500</p>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          Cancelar
        </button>
        <button type="submit" disabled={submitting || uploadingPhoto}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors">
          {submitting ? 'Guardando…' : initialData ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
}

