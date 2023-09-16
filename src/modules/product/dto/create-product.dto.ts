import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreateProductDto {
  @ApiProperty({
    description: `Carpet code`,
    example: '2346290837462098',
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    description: `Carpet color`,
    example: 'yellow',
  })
  @IsNotEmpty()
  @IsString()
  color: string;

  @ApiProperty({
    description: `Carpet date`,
    example: '2023-05-02 08:10:23.726769',
  })
  @IsOptional()
  @IsString()
  date: string;

  @ApiProperty({
    description: `Carpet count`,
    example: 3,
  })
  @IsNotEmpty()
  @IsNumber()
  count: number;

  @ApiProperty({
    description: `Carpet image url`,
    example: 'https://carpet.jpg',
  })
  @IsNotEmpty()
  @IsString()
  imgUrl: string;

  @ApiProperty({
    description: `Carpet price`,
    example: 140,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: `Carpet meter price`,
    example: 20,
  })
  @IsNotEmpty()
  @IsNumber()
  priceMeter: number;

  @ApiProperty({
    description: `Carpet coming price`,
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  comingPrice: number;

  @ApiProperty({
    description: `Carpet shape`,
    example: 'square',
  })
  @IsNotEmpty()
  @IsString()
  shape: string;

  @ApiProperty({
    description: `Carpet size`,
    example: '2x3',
  })
  @IsNotEmpty()
  @IsString()
  size: string;

  @ApiProperty({
    description: `Carpet style`,
    example: 'classic',
  })
  @IsNotEmpty()
  @IsString()
  style: string;

  @ApiProperty({
    description: `Carpet filial id`,
    example: 'uuid',
  })
  @IsNotEmpty()
  @IsString()
  filial: string;

  @ApiProperty({
    description: `Carpet model id`,
    example: 'uuid',
  })
  @IsNotEmpty()
  @IsString()
  model: string;

  @ApiProperty({
    description: `Carpet partiya id`,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  partiya: string;

  @IsOptional()
  @IsNumber()
  x: number;

  @IsOptional()
  @IsNumber()
  y: number;

  @IsOptional()
  @IsNumber()
  totalSize: number;

  @ApiProperty({
    description: `other imgs`,
    example: ['link', 'link', 'link'],
  })
  @IsOptional()
  @IsArray()
  otherImgs: string[];
}

export default CreateProductDto;
