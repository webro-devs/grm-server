import { IsNotEmpty, IsString, IsOptional, IsNumber, IsBoolean, IsEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

class CreateWithBaskerOrderDto {
  @ApiProperty({
    description: `price`,
    example: 1500,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly price: number;
}

export default CreateWithBaskerOrderDto;
