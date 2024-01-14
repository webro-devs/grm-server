import { IsOptional, IsString, IsNumber, IsArray, IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class UpdateProductExcelDto {
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
  @IsString()
  country: string;

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

  @IsOptional()
  @IsBoolean()
  displayPrice: boolean;

  @IsOptional()
  @IsNumber()
  cost: boolean;
}

export default UpdateProductExcelDto;
