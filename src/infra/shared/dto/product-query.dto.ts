import { isNumber, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

function parsePaginationQuery({ key, value }: TransformFnParams) {
  const int = parseInt(value);
  if (isNaN(int) || `${int}`.length !== value.length) {
    throw new BadRequestException(
      `${key} should be integer. Or pagination query string may be absent, then the page=1, limit=10 will be used.`,
    );
  }
  return int;
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
  readonly startPrice;

  @ApiProperty({
    description: `end price`,
    example: 50,
  })
  @IsOptional()
  @IsNumber()
  readonly endPrice;

  @ApiProperty({
    description: `style`,
    example: 'classic',
  })
  @IsOptional()
  @IsString()
  readonly style;

  @ApiProperty({
    description: `size`,
    example: '3x4',
  })
  @IsOptional()
  @IsString()
  readonly size;

  @ApiProperty({
    description: `shape`,
    example: 'square',
  })
  @IsOptional()
  @IsString()
  readonly shape;

  @ApiProperty({
    description: `color`,
    example: 'red',
  })
  @IsOptional()
  @IsString()
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
    description: `IsActive`,
    example: true,
  })
  @IsOptional()
  @IsString()
  readonly isActive?: string;

  constructor() {
    this.limit = this.limit ? this.limit : 100;
    this.page = this.page ? this.page : 1;
  }
}

export default ProductQueryDto;
