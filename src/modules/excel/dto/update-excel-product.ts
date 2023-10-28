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
  price: number;

  @IsOptional()
  @IsNumber()
  count: number;

  @IsOptional()
  @IsNumber()
  comingPrice: number;

  @IsOptional()
  @IsString()
  shape: string;

  @IsOptional()
  @IsString()
  size: string;

  @IsOptional()
  @IsString()
  style: string;

  @IsOptional()
  model: object;

  @IsOptional()
  @IsArray()
  otherImgs: string[];

  @IsOptional()
  @IsBoolean()
  isMetric: boolean;

  @IsOptional()
  @IsNumber()
  m2: number;
}
