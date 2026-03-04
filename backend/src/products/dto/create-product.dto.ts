import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductType } from '../../common/enums/product-type.enum';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
  @MaxLength(100)
  nombre: string;

  @Type(() => Number)
  @IsInt({ message: 'El colorId debe ser un entero válido' })
  colorId: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El tallaId debe ser un entero válido' })
  tallaId?: number;

  @IsString()
  @IsOptional()
  foto?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  descripcion?: string;

  @IsEnum(ProductType, {
    message: 'El tipo debe ser ZAPATO o BOLSA',
  })
  tipo: ProductType;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El precio debe tener máximo 2 decimales' },
  )
  @IsPositive({ message: 'El precio debe ser un número positivo' })
  precio: number;
}
