# Catálogo de Productos

CRUD de productos (zapatos y bolsas) con **NestJS + Prisma + PostgreSQL** y **React + Vite + Tailwind CSS**.

## Requisitos

- Node.js >= 18
- Docker

## Instalación

```bash
# Levantar todo con Docker
docker-compose up -d --build

# O desarrollo local:
docker-compose up -d postgres          # Solo BD

cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run start:dev                       # http://localhost:3000

cd ../frontend
npm install
npm run dev                             # http://localhost:5173
```

## Seeders

Carga colores, tallas y productos de ejemplo (ejecutar una sola vez):

```bash
# Desarrollo local
cd backend
npx prisma db seed

# Docker (con los contenedores levantados)
docker exec catalog_backend node dist/prisma/seed.js
```

## Variables de Entorno

Configurar en `backend/.env`:

```env
DATABASE_URL=postgresql://catalog_user:catalog_pass@localhost:5432/catalog_db
PORT=3000
CORS_ORIGIN=http://localhost:5173
```