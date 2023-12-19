import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreateProductExcDto {
  @ApiProperty({
    description: `Carpet code`,
    example: '2346290837462098',
  })
  @IsNotEmpty()
  @IsString()
  code: string;

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
    description: `Carpet shape`,
    example: 'UUID',
  })
  @IsNotEmpty()
  @IsString()
  shape: string;

  @ApiProperty({
    description: `Carpet size`,
    example: 'UUID',
  })
  @IsNotEmpty()
  @IsString()
  size: string;

  @ApiProperty({
    description: `Carpet style`,
    example: 'UUID',
  })
  @IsNotEmpty()
  @IsString()
  style: string;

  @ApiProperty({
    description: `Carpet filial id`,
    example: 'UUID',
  })
  @IsOptional()
  @IsString()
  filial?: string;

  @ApiProperty({
    description: `Carpet model id`,
    example: 'UUID',
  })
  @IsNotEmpty()
  @IsString()
  model: string;

  @ApiProperty({
    description: `Carpet partiya id`,
    example: 'UUID',
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
    example: '["link" , "link" , "link"]',
  })
  @IsOptional()
  otherImgs: string[];

  @ApiProperty({
    description: `Carpet color`,
    example: 'yellow',
  })
  @IsNotEmpty()
  @IsString()
  color: string;

  @ApiProperty({
    description: `Carpet color`,
    example: 'UUID',
  })
  @IsNotEmpty()
  @IsString()
  collection: string;

  @ApiProperty({
    description: `M2`,
    example: 9,
  })
  @IsNotEmpty()
  @IsNumber()
  m2: number;

  @ApiProperty({
    description: `M2`,
    example: 9,
  })
  @IsOptional()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: `M2`,
    example: 9,
  })
  @IsOptional()
  @IsNumber()
  commingPrice: number;
}

export default CreateProductExcDto;
