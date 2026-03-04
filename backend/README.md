# Backend — Catalog App

API REST construida con **NestJS** (Node.js) y base de datos **PostgreSQL** gestionada con **Prisma ORM**.

---

## Stack tecnológico

| Tecnología | Rol |
|---|---|
| NestJS | Framework principal (Node.js) |
| TypeScript | Lenguaje de programación |
| PostgreSQL | Base de datos relacional |
| Prisma ORM | Acceso y migraciones de base de datos |
| Multer | Subida de imágenes |
| class-validator | Validación de DTOs |

---

## Estructura de módulos

```
src/
├── app.module.ts          # Módulo raíz, importa todos los módulos
├── main.ts                # Punto de entrada, configura la app
├── products/              # CRUD completo de productos
├── catalog/               # Endpoint público del catálogo
├── upload/                # Subida de imágenes de productos
├── prisma/                # Servicio compartido de base de datos
└── common/                # Filtros, interceptores y enums globales
```

---

## Módulos

### `ProductsModule` — `/api/products`
Gestiona el CRUD completo de productos.

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/products` | Lista productos con filtros y paginación |
| GET | `/api/products/:id` | Detalle de un producto |
| GET | `/api/products/filter-options` | Colores y tallas disponibles para filtrar |
| POST | `/api/products` | Crea un producto nuevo |
| PATCH | `/api/products/:id` | Actualiza un producto existente |
| DELETE | `/api/products/:id` | Elimina un producto |

**Filtros disponibles en el listado:**
- `search` — busca por nombre
- `tipo` — `ZAPATO` o `BOLSA`
- `precioMin` / `precioMax` — rango de precio
- `colorId` / `tallaId` — filtro por color o talla
- `page` / `limit` — paginación

---

### `CatalogModule` — `/api/catalog`
Expone el catálogo de productos para consulta pública con los mismos filtros que `ProductsModule`, pensado para el frontend consumidor.

---

### `UploadModule` — `/api/upload`
Recibe imágenes mediante `multipart/form-data`, las guarda en la carpeta `uploads/` y devuelve la URL de acceso. Las imágenes se sirven como archivos estáticos en `/uploads/*`.

---

### `PrismaModule`
Servicio singleton que gestiona la conexión a PostgreSQL y se inyecta en todos los módulos que necesitan acceso a la base de datos.

---

## Modelos de base de datos

### `Product`
Campo principal de la aplicación.

| Campo | Tipo | Descripción |
|---|---|---|
| id | Int | Clave primaria autoincremental |
| nombre | String | Nombre del producto |
| tipo | ProductType | `ZAPATO` o `BOLSA` |
| precio | Float | Precio del producto |
| colorId | Int | Relación con Color |
| tallaId | Int? | Relación opcional con Talla |
| foto | String? | URL de la imagen |
| descripcion | String? | Descripción larga del producto |

### `Color`
Catálogo de colores disponibles (ej: Rojo, Negro, Blanco).

### `Talla`
Catálogo de tallas disponibles (ej: 36, 38, M, L).

---

## Infraestructura global

| Elemento | Función |
|---|---|
| `ValidationPipe` | Valida y transforma automáticamente todos los DTOs entrantes |
| `AllExceptionsFilter` | Captura cualquier error y devuelve una respuesta HTTP estructurada |
| `TransformInterceptor` | Envuelve todas las respuestas en un formato consistente `{ data, meta }` |
| CORS | Habilitado para el origen del frontend (`http://localhost:5173` por defecto) |

---

## Variables de entorno

```env
DATABASE_URL=postgresql://user:password@localhost:5432/catalog
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

---

## Comandos útiles

```bash
# Instalar dependencias
npm install

# Ejecutar migraciones
npx prisma migrate dev

# Poblar la base de datos con datos de prueba
npx prisma db seed

# Iniciar en desarrollo
npm run start:dev

# Build para producción
npm run build
```
