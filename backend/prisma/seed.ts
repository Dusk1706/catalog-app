import 'dotenv/config';
import { PrismaClient, ProductType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const colores = [
  'Negro', 'Blanco', 'Marrón', 'Rojo', 'Azul Marino',
  'Rosa', 'Beige', 'Dorado', 'Café', 'Gris', 'Verde',
];

const tallas = [
  '22', '23', '24', '25', '26', '27', '28', '29', '30', '31',
];

const products = [
  { nombre: 'Bota de Cuero', color: 'Negro', talla: '28', tipo: ProductType.ZAPATO, precio: 1299.99 },
  { nombre: 'Sandalia Verano', color: 'Beige', talla: '25', tipo: ProductType.ZAPATO, precio: 599.50 },
  { nombre: 'Tenis Deportivo', color: 'Blanco', talla: '27', tipo: ProductType.ZAPATO, precio: 899.00 },
  { nombre: 'Bolsa Tote', color: 'Café', talla: null, tipo: ProductType.BOLSA, precio: 1599.00 },
  { nombre: 'Clutch Elegante', color: 'Dorado', talla: null, tipo: ProductType.BOLSA, precio: 799.99 },
  { nombre: 'Mochila Casual', color: 'Azul Marino', talla: null, tipo: ProductType.BOLSA, precio: 450.00 },
  { nombre: 'Zapato Oxford', color: 'Marrón', talla: '26', tipo: ProductType.ZAPATO, precio: 1100.00 },
  { nombre: 'Bolsa Crossbody', color: 'Rosa', talla: null, tipo: ProductType.BOLSA, precio: 680.50 },
];

async function main() {
  console.log('Seeding database...');

  // Seed catalog tables
  const colorMap = new Map<string, number>();
  for (const nombre of colores) {
    const c = await prisma.color.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
    colorMap.set(nombre, c.id);
  }
  console.log(`Seeded ${colores.length} colores`);

  const tallaMap = new Map<string, number>();
  for (const valor of tallas) {
    const t = await prisma.talla.upsert({
      where: { valor },
      update: {},
      create: { valor },
    });
    tallaMap.set(valor, t.id);
  }
  console.log(`Seeded ${tallas.length} tallas`);

  // Seed products
  for (const { color, talla, ...rest } of products) {
    const colorId = colorMap.get(color)!;
    const tallaId = talla ? tallaMap.get(talla)! : null;
    await prisma.product.create({
      data: { ...rest, colorId, tallaId },
    });
  }
  console.log(`Seeded ${products.length} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
