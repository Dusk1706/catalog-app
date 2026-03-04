import 'dotenv/config';
import { PrismaClient, ProductType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

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

  for (const product of products) {
    await prisma.product.create({ data: product });
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
