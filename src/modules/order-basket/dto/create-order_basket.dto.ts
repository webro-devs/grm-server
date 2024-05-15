import { IsNotEmpty, IsString, IsOptional, IsNumber, IsBoolean, IsEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

class CreateOrderBasketDto {
  @ApiProperty({
    description: `product id`,
    example: 'uuid',
  })
  @IsNotEmpty()
  @IsString()
  readonly product: string;

  @ApiProperty({
    description: `Is metric ?`,
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  readonly isMetric: boolean;

  @ApiProperty({
    description: `x`,
    example: 3,
    required: false,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly x: number;

  @IsEmpty()
  seller: string;
}

export default CreateOrderBasketDto;
