-- CreateTable
CREATE TABLE "colores" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    CONSTRAINT "colores_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "tallas" (
    "id" SERIAL NOT NULL,
    "valor" TEXT NOT NULL,
    CONSTRAINT "tallas_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "colores_nombre_key" ON "colores"("nombre");
CREATE UNIQUE INDEX "tallas_valor_key" ON "tallas"("valor");

-- Populate catalog tables from existing product data
INSERT INTO "colores" ("nombre")
SELECT DISTINCT "color" FROM "products" WHERE "color" IS NOT NULL
ORDER BY "color";

INSERT INTO "tallas" ("valor")
SELECT DISTINCT "talla" FROM "products" WHERE "talla" IS NOT NULL
ORDER BY "talla";

-- Add FK columns (nullable initially)
ALTER TABLE "products" ADD COLUMN "color_id" INTEGER;
ALTER TABLE "products" ADD COLUMN "talla_id" INTEGER;

-- Migrate existing data
UPDATE "products" p
SET "color_id" = c."id"
FROM "colores" c
WHERE p."color" = c."nombre";

UPDATE "products" p
SET "talla_id" = t."id"
FROM "tallas" t
WHERE p."talla" = t."valor";

-- Make color_id required now that data is migrated
ALTER TABLE "products" ALTER COLUMN "color_id" SET NOT NULL;

-- Drop old columns
ALTER TABLE "products" DROP COLUMN "color";
ALTER TABLE "products" DROP COLUMN "talla";

-- Add foreign keys
ALTER TABLE "products" ADD CONSTRAINT "products_color_id_fkey" FOREIGN KEY ("color_id") REFERENCES "colores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "products" ADD CONSTRAINT "products_talla_id_fkey" FOREIGN KEY ("talla_id") REFERENCES "tallas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
