import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class UpdateProductDto {
  @ApiProperty({
    description: `Carpet code`,
    example: '2346290837462098',
  })
  @IsOptional()
  @IsString()
  code: string;

  @ApiProperty({
    description: `Carpet country`,
    example: 'Uzbekistan',
  })
  @IsOptional()
  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  collection: string;

  @ApiProperty({
    description: `Carpet color`,
    example: 'yellow',
  })
  @IsOptional()
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
  @IsOptional()
  @IsNumber()
  count: number;

  @ApiProperty({
    description: `Carpet image url`,
    example: 'https://carpet.jpg',
  })
  @IsOptional()
  @IsString()
  imgUrl: string;

  @ApiProperty({
    description: `Carpet price`,
    example: 140,
  })
  @IsOptional()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: `Carpet price`,
    example: 140,
  })
  @IsOptional()
  @IsNumber()
  secondPrice: number;

  @IsOptional()
  @IsNumber()
  priceMeter: number;

  @ApiProperty({
    description: `Carpet coming price`,
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  comingPrice: number;

  @ApiProperty({
    description: `Carpet shape`,
    example: 'square',
  })
  @IsOptional()
  @IsString()
  shape: string;

  @ApiProperty({
    description: `Carpet size`,
    example: '2x3',
  })
  @IsOptional()
  @IsString()
  size: string;

  @ApiProperty({
    description: `Carpet style`,
    example: 'classic',
  })
  @IsOptional()
  @IsString()
  style: string;

  @ApiProperty({
    description: `Carpet filial id`,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  filial: string;

  @ApiProperty({
    description: `Carpet model id`,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  model: string;

  @ApiProperty({
    description: `other imgs`,
    example: ['link', 'link', 'link'],
  })
  @IsOptional()
  @IsArray()
  otherImgs: string[];

  @ApiProperty({
    description: `isMetric`,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isMetric: boolean;

  @ApiProperty({
    description: `isInternetShop`,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isInternetShop: boolean;
  
  @ApiProperty({
    description: `internetInfo`,
    example: '...',
  })
  @IsOptional()
  @IsString()
  internetInfo: string;

  @IsOptional()
  x: number;

  @IsOptional()
  y: number;

  @IsOptional()
  totalSize: number;
}

export default UpdateProductDto;
