-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('ZAPATO', 'BOLSA');

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "talla" TEXT,
    "tipo" "ProductType" NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);
