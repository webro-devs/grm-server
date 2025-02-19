import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Product } from '../../product/product.entity';

export class CreateBookingDto {
  @ApiProperty({
    description: `product`,
    example: 'uuid',
  })
  @IsNotEmpty()
  @IsString()
  readonly product: Product;

  @ApiProperty({
    description: `count`,
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly count: number;
}
