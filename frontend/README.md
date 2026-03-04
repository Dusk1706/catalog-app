# Frontend — Catalog App

Interfaz web construida con **React + TypeScript + Vite** para gestionar el catálogo de productos (zapatos y bolsas).

---

## Stack tecnológico

| Tecnología | Rol |
|---|---|
| React 18 | Framework de UI |
| TypeScript | Lenguaje de programación |
| Vite | Bundler y servidor de desarrollo |
| React Router v6 | Navegación entre páginas |
| Axios | Cliente HTTP para consumir la API |
| Tailwind CSS | Estilos utilitarios |

---

## Estructura del proyecto

```
src/
├── App.tsx               # Enrutador principal
├── main.tsx              # Punto de entrada
├── config.ts             # URL base del backend
├── pages/                # Páginas de la aplicación
├── components/           # Componentes reutilizables
├── hooks/                # Lógica de estado compartida
├── api/                  # Capa de comunicación con el backend
├── types/                # Tipos TypeScript compartidos
├── constants/            # Configuración estática de tipos de producto
└── utils/                # Funciones utilitarias (formateo)
```

---

## Páginas

### `Dashboard` — `/`
Página principal de la aplicación. Muestra la tabla completa de productos con:
- **Barra de búsqueda** — filtra productos por nombre en tiempo real
- **Panel de filtros** — filtra por tipo (Zapato/Bolsa), rango de precio, color y talla
- **Tabla de productos** — lista paginada con columnas de nombre, tipo, color, talla, precio y foto
- **Paginación** — navega entre páginas de resultados
- **Botón "Nuevo producto"** — abre el formulario de creación
- **Acciones por fila** — editar o eliminar cada producto

### `ProductDetail` — `/products/:id`
Vista de detalle de un producto específico. Muestra toda la información del producto (foto, nombre, tipo, precio, color, talla, descripción, fecha de creación) con botones para editar o eliminar.

---

## Componentes

### Productos (`components/products/`)

| Componente | Descripción |
|---|---|
| `ProductTable` | Tabla con la lista de productos, acciones de editar/eliminar y enlace al detalle |
| `ProductFilters` | Panel lateral de filtros (tipo, precio, color, talla) |
| `ProductForm` | Formulario controlado para crear o editar un producto |
| `ProductFormModal` | Envuelve `ProductForm` en un modal, se carga de forma diferida (lazy) |
| `ProductThumbnail` | Miniatura de la foto del producto con fallback si no tiene imagen |
| `ProductTypeBadge` | Badge visual que diferencia entre `ZAPATO` y `BOLSA` con color e icono |

### UI genérica (`components/ui/`)

| Componente | Descripción |
|---|---|
| `Modal` | Contenedor modal reutilizable con overlay |
| `ConfirmDialog` | Diálogo de confirmación para acciones destructivas (eliminar) |
| `SearchBar` | Input de búsqueda con debounce |
| `Pagination` | Controles de paginación (anterior/siguiente, número de página) |
| `LoadingSpinner` | Indicador de carga animado |
| `Icons` | Colección de iconos SVG (editar, eliminar, añadir, chevron, etc.) |

---

## Hooks

### `useProducts`
Hook central que encapsula toda la lógica de estado de la lista de productos:
- Carga los productos llamando a la API según los filtros activos
- Expone funciones `createProduct`, `updateProduct`, `deleteProduct`
- Gestiona `filters`, `meta` (paginación) y estados de carga/error
- Usa `useTransition` de React 18 para mantener la UI responsive durante las peticiones

---

## Capa API (`api/`)

### `products.api.ts`
Conjunto de funciones que encapsulan las llamadas HTTP al backend:

| Función | Descripción |
|---|---|
| `getAll(params)` | Lista paginada con filtros |
| `getById(id)` | Detalle de un producto |
| `getFilterOptions()` | Colores y tallas disponibles |
| `create(payload)` | Crea un producto nuevo |
| `update(id, payload)` | Actualiza un producto |
| `delete(id)` | Elimina un producto |
| `uploadPhoto(file)` | Sube una imagen y devuelve su URL |

### `axios.ts`
Instancia de Axios preconfigurada con la `baseURL` del backend (`/api`).

---

## Tipos principales (`types/product.ts`)

```ts
// Tipo de producto
enum ProductType { ZAPATO = 'ZAPATO', BOLSA = 'BOLSA' }

// Producto completo devuelto por la API
interface Product {
  id, nombre, tipo, precio, colorId, tallaId,
  foto?, descripcion?, color, talla, createdAt
}

// Parámetros de filtro/paginación
interface ProductQueryParams {
  search?, tipo?, precioMin?, precioMax?,
  colorId?, tallaId?, page?, limit?
}
```

---

## Variables de entorno

```env
VITE_BACKEND_URL=http://localhost:3000
```

---

## Comandos útiles

```bash
# Instalar dependencias
npm install

# Iniciar en desarrollo
npm run dev

# Build para producción
npm run build

# Vista previa del build
npm run preview
```
