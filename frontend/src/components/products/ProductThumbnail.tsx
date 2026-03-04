import type { ProductType } from '../../types/product';
import { BACKEND_URL } from '../../config';
import { getTypeConfig } from '../../constants/product';

interface ProductThumbnailProps {
  foto: string | null;
  tipo: ProductType;
  nombre: string;
  size?: 'sm' | 'lg';
  onClick?: () => void;
}

export function ProductThumbnail({ foto, tipo, nombre, size = 'sm', onClick }: ProductThumbnailProps) {
  const config = getTypeConfig(tipo);
  const sizeClass = size === 'lg' ? 'w-full min-h-80' : 'w-10 h-10';
  const emojiSize = size === 'lg' ? 'text-8xl' : 'text-lg';
  const imgClass = size === 'lg' ? 'max-h-96 max-w-full object-contain rounded-xl' : 'w-full h-full object-cover';

  const content = foto ? (
    <img src={`${BACKEND_URL}${foto}`} alt={nombre} className={imgClass} />
  ) : (
    <div className="text-center text-gray-300">
      <span className={`${emojiSize} block`}>{config.emoji}</span>
      {size === 'lg' ? <p className="text-sm text-gray-400 mt-3">Sin foto</p> : null}
    </div>
  );

  const baseClass = `rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center ${sizeClass}`;
  const interactiveClass = onClick ? 'cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all' : '';

  return (
    <div className={`${baseClass} ${interactiveClass} shrink-0`} onClick={onClick}>
      {content}
    </div>
  );
}
