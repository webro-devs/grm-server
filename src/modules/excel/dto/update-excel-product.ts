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

export default class UpdateProductsArrayDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateProductExcelDto)
  @IsOptional() // Make the entire array optional
  products?: UpdateProductExcelDto[];
}

class UpdateProductExcelDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  code: string;

  @IsOptional()
  color: object;

  @IsOptional()
  @IsString()
  imgUrl: string;

  @IsOptional()
  @IsNumber()
  price2: number;

  @IsOptional()
  @IsNumber()
  count: number;

  @IsOptional()
  @IsNumber()
  comingPrice: number;

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
  model: object;

  @IsOptional()
  plette: object;

  @IsOptional()
  @IsArray()
  otherImgs: string[];

  @IsOptional()
  @IsNumber()
  m2: number;

  @IsOptional()
  @IsBoolean()
  isMetric: boolean;
}
