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

class KassaQueryDto {
  @ApiProperty({
    description: `start date`,
    example: '2023-05-02 08:10:23.726769',
    required: false
  })
  @IsOptional()
  @IsString()
  readonly startDate: string;

  @ApiProperty({
    description: `end date`,
    example: '2023-05-02 08:10:23.726769',
    required: false
  })
  @IsOptional()
  @IsString()
  readonly endDate: string;

  @ApiProperty({
    description: `filial id`,
    example: 'uuid',
    required: false
  })
  @IsOptional()
  @IsString()
  readonly filial: string;

  @ApiProperty({
    description: `is active type`,
    example: 'accept',
    required: false
  })
  @IsOptional()
  @IsString()
  @IsEnum(orderTypeEnum)
  readonly isActive: orderTypeEnum;

  @ApiProperty({
    description: `Limit`,
    example: 20,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Transform(parsePaginationQuery)
  readonly limit: number;

  @ApiProperty({
    description: `Page`,
    example: 1,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Transform(parsePaginationQuery)
  readonly page: number;

  constructor() {
    this.limit = this.limit ? this.limit : 100;
    this.page = this.page ? this.page : 1;
  }
}

export default KassaQueryDto;
