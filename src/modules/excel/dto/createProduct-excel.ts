import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreateProductExcDto {
  @ApiProperty({
    description: `Carpet code`,
    example: '23462908374643',
    required: false,
  })
  @IsOptional()
  @IsString()
  code: string;

  @ApiProperty({
    description: `Carpet count`,
    example: 3,
  })
  @IsNotEmpty()
  @IsNumber()
  count: number;

  @IsOptional()
  @IsNumber()
  displayPrice: number;

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
  @IsOptional()
  @IsString()
  shape: string;

  @ApiProperty({
    description: `Carpet size`,
    example: 'UUID',
  })
  @IsOptional()
  @IsString()
  size: string;

  @ApiProperty({
    description: `Carpet style`,
    example: 'UUID',
  })
  @IsOptional()
  @IsString()
  style: string;

  @ApiProperty({
    description: `Carpet color`,
    example: 'yellow',
  })
  @IsOptional()
  @IsString()
  color: string;

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

  @IsOptional()
  @IsBoolean()
  isMetric: boolean;

  @IsOptional()
  @IsBoolean()
  isEdited: boolean;

  @IsOptional()
  @IsString()
  partiya: string;
}

export default CreateProductExcDto;
