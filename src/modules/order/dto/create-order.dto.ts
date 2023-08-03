import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreateOrderDto {
  @ApiProperty({
    description: `seller id`,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  readonly seller: string;

  @ApiProperty({
    description: `product id`,
    example: 'uuid',
  })
  @IsNotEmpty()
  @IsString()
  readonly product: string;

  @ApiProperty({
    description: `price`,
    example: 1500,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @ApiProperty({
    description: `plasticSum`,
    example: 1000,
  })
  @IsOptional()
  @IsNumber()
  readonly plasticSum: number;

  // @ApiProperty({
  //   description: `price`,
  //   example: 1500,
  // })
  // @IsNotEmpty()
  // @IsNumber()
  // readonly count: number;

  @ApiProperty({
    description: `date`,
    example: '2023-05-02 08:10:23.726769',
  })
  @IsOptional()
  @IsString()
  readonly date: string;

  @ApiProperty({
    description: `kassa id`,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  readonly kassa: string;
}

export default CreateOrderDto;
