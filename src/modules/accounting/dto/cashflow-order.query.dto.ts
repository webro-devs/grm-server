import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

function checkType({ key, value }: TransformFnParams) {
  if (value !== 'income' && value !== 'expense') {
    throw new BadRequestException(`${key} should be income or expense.`);
  }
  return value;
}

class CreateColorDto {
  @ApiProperty({
    description: `limit`,
    example: 10,
    default: 10,
  })
  @IsOptional()
  @IsNumber()
  readonly limit: number;

  @ApiProperty({
    description: `page`,
    example: 1,
  })
  @IsOptional()
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
    description: `type`,
    example: 'income or expence',
  })
  @IsOptional()
  @IsString()
  @Transform(checkType)
  readonly type: string;

  constructor() {
    this.limit = this.limit ? this.limit : 100;
    this.page = this.page ? this.page : 1;
  }
}

export default CreateColorDto;
