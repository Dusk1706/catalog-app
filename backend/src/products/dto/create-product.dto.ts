import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { ProductType } from '../../common/enums/product-type.enum';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
  @MaxLength(100)
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'El color es obligatorio' })
  @MaxLength(50)
  color: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  talla?: string;

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
