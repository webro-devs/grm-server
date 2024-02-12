import { IsNotEmpty, IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

function parseXValue({ key, value }: TransformFnParams) {
  const int = Number(value / 100);
  if (isNaN(int)) {
    throw new BadRequestException(
      `${key} should be integer. Or pagination query string may be absent, then the page=1, limit=10 will be used.`,
    );
  }
  return int;
}
class CreateOrderDto {
  @ApiProperty({
    description: `product id`,
    example: 'uuid',
  })
  @IsNotEmpty()
  @IsString()
  readonly product: string;

  @ApiProperty({
    description: `price`,
    example: 1500,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @ApiProperty({
    description: `Is metric ?`,
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  readonly isMetric: boolean;

  @ApiProperty({
    description: `plasticSum`,
    example: 1000,
  })
  @IsOptional()
  @IsNumber()
  readonly plasticSum: number;

  @ApiProperty({
    description: `x`,
    example: 3,
    required: false,
  })
  @IsNotEmpty()
  @IsNumber()
  @Transform(parseXValue)
  readonly x: number;

  @ApiProperty({
    description: `kassa id`,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  readonly kassa: string;
}

export default CreateOrderDto;
