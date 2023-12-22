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
  })
  @IsNotEmpty()
  @IsString()
  imgUrl: string;

  @ApiProperty({
    description: `other imgs`,
    example: '["link" , "link" , "link"]',
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
    description: `Carpet plette`,
    example: 'UUID',
  })
  @IsNotEmpty()
  @IsString()
  plette: string;

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

  @ApiProperty({
    description: `plus price`,
    example: 5,
  })
  @IsOptional()
  @IsNumber()
  price2: number;

  @ApiProperty({
    description: `comming price`,
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  commingPrice: number;

  @ApiProperty({
    description: `price meter`,
    example: 15,
  })
  @IsOptional()
  @IsNumber()
  priceMeter: number;
}

export default CreateProductExcDto;
