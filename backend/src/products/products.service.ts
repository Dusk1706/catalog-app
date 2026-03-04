import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { Prisma } from '@prisma/client';

const PRODUCT_INCLUDE = {
  color: true,
  talla: true,
} satisfies Prisma.ProductInclude;

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
      include: PRODUCT_INCLUDE,
    });
  }

  async findAll(query: QueryProductDto) {
    const { search, tipo, precioMin, precioMax, tallaId, colorId, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      ...(tipo && { tipo }),
      ...(search && {
        OR: [
          { nombre: { contains: search, mode: 'insensitive' as const } },
          { color: { is: { nombre: { contains: search, mode: 'insensitive' as const } } } },
        ],
      }),
      ...((precioMin !== undefined || precioMax !== undefined) && {
        precio: {
          ...(precioMin !== undefined && { gte: precioMin }),
          ...(precioMax !== undefined && { lte: precioMax }),
        },
      }),
      ...(tallaId && { tallaId }),
      ...(colorId && { colorId }),
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: PRODUCT_INCLUDE,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getFilterOptions() {
    const [colores, tallas, priceRange] = await Promise.all([
      this.prisma.color.findMany({ orderBy: { nombre: 'asc' } }),
      this.prisma.talla.findMany({ orderBy: { valor: 'asc' } }),
      this.prisma.product.aggregate({
        _min: { precio: true },
        _max: { precio: true },
      }),
    ]);

    return {
      colores,
      tallas,
      precioMin: priceRange._min.precio ?? 0,
      precioMax: priceRange._max.precio ?? 0,
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: PRODUCT_INCLUDE,
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: PRODUCT_INCLUDE,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.product.delete({
      where: { id },
    });
  }
}
