import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';
import orderTypeEnum from '../enum/order.type.enum';

function parsePaginationQuery({ key, value }: TransformFnParams) {
  const int = Number(value);
  if (isNaN(int) || `${int}`.length !== value.length) {
    throw new BadRequestException(
      `${key} should be integer. Or pagination query string may be absent, then the page=1, limit=10 will be used.`,
    );
  }
  return int;
}

class OrderQueryDto {
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
    description: `kassa id`,
    example: 'uuid',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly kassa;

  @ApiProperty({
    description: `filial id`,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  readonly filialId;

  @ApiProperty({
    description: `is active type`,
    example: 'accept',
  })
  @IsOptional()
  @IsString()
  @IsEnum(orderTypeEnum)
  readonly isActive: orderTypeEnum;

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

  @IsOptional()
  style: string;
  @IsOptional()
  shape: string;
  @IsOptional()
  color: string;
  @IsOptional()
  model: string;
  @IsOptional()
  collection: string;
  @IsOptional()
  size: string;

  constructor() {
    this.limit = this.limit ? this.limit : 100;
    this.page = this.page ? this.page : 1;
    this.isMetric = this.isMetric == 'true' ? true : false;
  }
}

export default OrderQueryDto;
