const priceFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

const dateFormatter = new Intl.DateTimeFormat('es-MX', {
  dateStyle: 'long',
  timeStyle: 'short',
});

export const formatPrice = (precio: number) => priceFormatter.format(precio);

export const formatDate = (iso: string) => dateFormatter.format(new Date(iso));
