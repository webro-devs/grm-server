import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreateProductExcDto {
  @ApiProperty({
    description: `Carpet code`,
    example: '23462908374643',
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
    required: false,
  })
  @IsOptional()
  @IsString()
  imgUrl: string;

  @ApiProperty({
    description: `other imgs`,
    example: '["link" , "link" , "link"]',
    required: false,
  })
  @IsOptional()
  otherImgs: string[];

  @ApiProperty({
    description: `Carpet shape`,
    example: 'UUID',
  })
  @IsNotEmpty()
  @IsString()
  shape: string;

  @ApiProperty({
    description: `Carpet palette`,
    example: 'UUID',
  })
  @IsNotEmpty()
  @IsString()
  palette: string;

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
    description: `Carpet color`,
    example: 'yellow',
  })
  @IsNotEmpty()
  @IsString()
  color: string;

  @ApiProperty({
    description: `Carpet Country`,
    example: 'USA',
    required: false,
  })
  @IsOptional()
  @IsString()
  country: string;

  @ApiProperty({
    description: `Carpet model id`,
    example: 'UUID',
  })
  @IsNotEmpty()
  @IsString()
  model: string;

  @ApiProperty({
    description: `Carpet color`,
    example: 'UUID',
  })
  @IsNotEmpty()
  @IsString()
  collection: string;

  @ApiProperty({
    description: `Carpet partiya id`,
    example: 'UUID',
  })
  @IsOptional()
  @IsString()
  partiya: string;

  @IsOptional()
  @IsNumber()
  secondPrice: number;

  @IsOptional()
  @IsNumber()
  commingPrice: number;

  @ApiProperty({
    description: `Collection price`,
    example: '8',
  })
  @IsOptional()
  @IsNumber()
  collectionPrice: number;

  @ApiProperty({
    description: `price meter`,
    example: 15,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  priceMeter: number;

  @ApiProperty({
    description: `Is meteric`,
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isMetric: boolean;

  @IsOptional()
  @IsBoolean()
  isEdited: boolean;
}

export default CreateProductExcDto;
