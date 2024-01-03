import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateProductsArrayDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateProductExcelDto)
  @IsOptional() // Make the entire array optional
  products?: UpdateProductExcelDto[];
}

class UpdateProductExcelDto {
  @ApiProperty({
    description: `Carpet id`,
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  code: string;

  @ApiProperty({
    description: `Carpet color.`,
    example: 'UUID',
  })
  @IsOptional()
  color: object;

  @IsOptional()
  @IsString()
  imgUrl: string;

  @IsOptional()
  @IsNumber()
  secondPrice: number;

  @IsOptional()
  @IsNumber()
  count: number;

  @IsOptional()
  @IsNumber()
  country: number;

  @IsOptional()
  @IsNumber()
  comingPrice: number;

  @IsOptional()
  @IsNumber()
  collectionPrice: number;

  @ApiProperty({
    description: `Carpet price by meter.`,
    example: 15,
  })
  @IsOptional()
  @IsNumber()
  priceMeter: number;

  @IsOptional()
  shape: string;

  @IsOptional()
  size: string;

  @IsOptional()
  style: string;

  @IsOptional()
  collection: string;

  @IsOptional()
  model: object;

  @IsOptional()
  palette: object;

  @IsOptional()
  @IsArray()
  otherImgs: string[];

  @IsOptional()
  @IsNumber()
  m2: number;

  @IsOptional()
  @IsBoolean()
  isMetric: boolean;

  @IsOptional()
  @IsBoolean()
  isEdited: boolean;
}
