import type { ProductType } from '../../types/product';
import { getTypeConfig } from '../../constants/product';

interface ProductTypeBadgeProps {
  tipo: ProductType;
  showEmoji?: boolean;
  size?: 'sm' | 'md';
}

export function ProductTypeBadge({ tipo, showEmoji = false, size = 'sm' }: ProductTypeBadgeProps) {
  const config = getTypeConfig(tipo);
  const sizeClass = size === 'md' ? 'px-2.5 py-1 text-xs font-semibold' : 'px-2 py-0.5 text-xs font-medium';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full ${sizeClass} ${config.badgeClass}`}>
      {showEmoji ? <span>{config.emoji}</span> : null}
      {config.label}
    </span>
  );
}
