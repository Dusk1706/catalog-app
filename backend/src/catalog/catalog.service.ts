import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  /* ── Colores ── */

  findAllColores() {
    return this.prisma.color.findMany({ orderBy: { nombre: 'asc' } });
  }

  async createColor(nombre: string) {
    try {
      return await this.prisma.color.create({ data: { nombre: nombre.trim() } });
    } catch {
      throw new ConflictException(`El color "${nombre}" ya existe`);
    }
  }

  async removeColor(id: number) {
    const count = await this.prisma.product.count({ where: { colorId: id } });
    if (count > 0) {
      throw new ConflictException('No se puede eliminar un color que está siendo usado por productos');
    }
    return this.prisma.color.delete({ where: { id } });
  }

  /* ── Tallas ── */

  findAllTallas() {
    return this.prisma.talla.findMany({ orderBy: { valor: 'asc' } });
  }

  async createTalla(valor: string) {
    try {
      return await this.prisma.talla.create({ data: { valor: valor.trim() } });
    } catch {
      throw new ConflictException(`La talla "${valor}" ya existe`);
    }
  }

  async removeTalla(id: number) {
    const count = await this.prisma.product.count({ where: { tallaId: id } });
    if (count > 0) {
      throw new ConflictException('No se puede eliminar una talla que está siendo usada por productos');
    }
    return this.prisma.talla.delete({ where: { id } });
  }
}
