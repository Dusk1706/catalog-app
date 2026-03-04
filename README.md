# Catálogo de Productos

CRUD de productos (zapatos y bolsas) con NestJS + Prisma + PostgreSQL y frontend en React + Vite + Tailwind CSS.

## Requisitos

- Node.js >= 18
- Docker

## Instalación

```bash
# Base de datos
docker-compose up -d

# Backend
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run start:dev         # http://localhost:3000

# Frontend (otra terminal)
cd frontend
npm install
npm run dev               # http://localhost:5173
```

## Variables de Entorno

Configurar en `backend/.env`:

```
DATABASE_URL=postgresql://catalog_user:catalog_pass@localhost:5432/catalog_db
PORT=3000
CORS_ORIGIN=http://localhost:5173
```