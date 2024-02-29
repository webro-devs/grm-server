import { IsNumber, IsOptional, IsString } from 'class-validator';
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

class CreateCashflowDto {
  @ApiProperty({
    description: `limit`,
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Transform(parsePaginationQuery)
  @IsNumber()
  readonly limit: number;

  @ApiProperty({
    description: `page`,
    example: 1,
  })
  @IsOptional()
  @Transform(parsePaginationQuery)
  @IsNumber()
  readonly page: number;

  @ApiProperty({
    description: `Filial`,
    example: 'UUID',
  })
  @IsOptional()
  @IsString()
  readonly filial: string;

  @ApiProperty({
    description: `startDate`,
    example: '2024-05-22',
  })
  @IsOptional()
  @IsString()
  readonly startDate: Date;

  @ApiProperty({
    description: `endDate`,
    example: '2024-06-23',
  })
  @IsOptional()
  @IsString()
  readonly endDate: Date;

  @ApiProperty({
    description: `type`,
    example: 'income or expence',
  })
  @IsOptional()
  @IsString()
  readonly type: string;

  constructor() {
    this.limit = this.limit ? this.limit : 100;
    this.page = this.page ? this.page : 1;
  }
}

export default CreateCashflowDto;
