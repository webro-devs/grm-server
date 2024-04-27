import {
  IsNumber,
  IsOptional, IsString,
} from 'class-validator';
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

class QrBaseQueryDto {
  @ApiProperty({
    description: `Code`,
    example: "13535751",
    required: false
  })
  @IsOptional()
  @IsString()
  readonly code: string;

  @ApiProperty({
    description: `Model`,
    example: '1236',required: false
  })
  @IsOptional()
  @IsString()
  readonly model: string;

  @ApiProperty({
    description: `Collection`,
    example: 'Sana Hali',required: false
  })
  @IsOptional()
  @IsString()
  readonly collection: string;

  @ApiProperty({
    description: `shape`,
    example: 'pentagon',required: false
  })
  @IsOptional()
  @IsString()
  readonly shape: string;

  @ApiProperty({
    description: `size`,
    example: '200x300',required: false
  })
  @IsOptional()
  @IsString()
  readonly size: string;

  @IsOptional()
  @IsString()
  search: string;

  @ApiProperty({
    description: `style`,
    example: 'Classic',required: false
  })
  @IsOptional()
  @IsString()
  readonly style: string;

  @ApiProperty({
    description: `limit`,
    example: 15,required: false
  })
  @IsOptional()
  @IsNumber()
  @Transform(parsePaginationQuery)
  readonly limit: number;

  @ApiProperty({
    description: `Page`,
    example: 1,required: false
  })
  @IsOptional()
  @IsNumber()
  @Transform(parsePaginationQuery)
  readonly page: number = 1;

  constructor() {
    this.limit = this.limit ? this.limit : 15;
    this.page = this.page ? this.page : 1;
  }
}

export default QrBaseQueryDto;
