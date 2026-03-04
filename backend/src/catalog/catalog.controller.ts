import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  /* ── Colores ── */

  @Get('colores')
  findAllColores() {
    return this.catalogService.findAllColores();
  }

  @Post('colores')
  @HttpCode(HttpStatus.CREATED)
  createColor(@Body('nombre') nombre: string) {
    return this.catalogService.createColor(nombre);
  }

  @Delete('colores/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeColor(@Param('id', ParseIntPipe) id: number) {
    await this.catalogService.removeColor(id);
  }

  /* ── Tallas ── */

  @Get('tallas')
  findAllTallas() {
    return this.catalogService.findAllTallas();
  }

  @Post('tallas')
  @HttpCode(HttpStatus.CREATED)
  createTalla(@Body('valor') valor: string) {
    return this.catalogService.createTalla(valor);
  }

  @Delete('tallas/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTalla(@Param('id', ParseIntPipe) id: number) {
    await this.catalogService.removeTalla(id);
  }
}
