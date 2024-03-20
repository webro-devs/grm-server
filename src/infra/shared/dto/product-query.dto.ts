import { IsArray, isArray, IsBoolean, isNumber, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

function parsePaginationQuery({ key, value }: TransformFnParams) {
  const int = Number(value);
  if (isNaN(int) || `${int}`.length !== value.length) {
    throw new BadRequestException(
      `${key} should be integer. Or pagination query string may be absent, then the page=1, limit=10 will be used.`,
    );
  }
  return int;
}

function parseTextToArray({ key, value }: TransformFnParams) {
  const arr = value ? JSON.parse(value) : '';
  if (!isArray(arr)) {
    throw new BadRequestException(`${key} should be array`);
  }
  return arr;
}

class ProductQueryDto {
  @ApiProperty({
    description: `start date`,
    example: '2023-05-02 08:10:23.726769',
  })
  @IsOptional()
  @IsString()
  readonly startDate;

  @ApiProperty({
    description: `end date`,
    example: '2023-05-02 08:10:23.726769',
  })
  @IsOptional()
  @IsString()
  readonly endDate;

  @ApiProperty({
    description: `start price`,
    example: 20,
  })
  @IsOptional()
  @IsNumber()
  @Transform(parsePaginationQuery)
  readonly startPrice;

  @ApiProperty({
    description: `end price`,
    example: 50,
  })
  @IsOptional()
  @IsNumber()
  @Transform(parsePaginationQuery)
  readonly endPrice;

  @ApiProperty({
    description: `style`,
    example: '["Modern", "Classic"]',
  })
  @IsOptional()
  @IsArray()
  @Transform(parseTextToArray)
  readonly style;

  @ApiProperty({
    description: `size`,
    example: '["3x4", "5x6"]',
  })
  @IsOptional()
  @IsArray()
  @Transform(parseTextToArray)
  readonly size;

  @ApiProperty({
    description: `shape`,
    example: '["Triangle", "Square"]',
  })
  @IsOptional()
  @IsArray()
  @Transform(parseTextToArray)
  readonly shape;

  @ApiProperty({
    description: `color`,
    example: '["Red", "Yellow"]',
  })
  @IsOptional()
  @IsArray()
  @Transform(parseTextToArray)
  readonly color;

  @ApiProperty({
    description: `collection id`,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  readonly collectionId;

  @ApiProperty({
    description: `model id`,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  readonly modelId;

  @ApiProperty({
    description: `filial id`,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  readonly filialId;

  @ApiProperty({
    description: `partiya id`,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  readonly partiyaId;

  @ApiProperty({
    description: `search`,
    example: '...',
  })
  @IsOptional()
  @IsString()
  readonly search;

  @ApiProperty({
    description: `internet shop product need come`,
    example: true,
  })  
  @IsOptional()
  readonly isInternetShop;

  @ApiProperty({
    description: `Limit`,
    example: 20,
  })
  @IsOptional()
  @IsNumber()
  @Transform(parsePaginationQuery)
  readonly limit: number;

  @ApiProperty({
    description: `Page`,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Transform(parsePaginationQuery)
  readonly page: number = 1;

  @ApiProperty({
    description: `isMetric`,
    example: 'true',
    required: false,
  })
  @IsOptional()
  readonly isMetric: string | boolean;

  constructor() {
    this.limit = this.limit ? this.limit : 100;
    this.page = this.page ? this.page : 1;
    this.isMetric = this.isMetric == 'true' ? true : false;
  }
}

export default ProductQueryDto;
