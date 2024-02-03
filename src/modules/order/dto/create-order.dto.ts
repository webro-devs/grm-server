import { IsNotEmpty, IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
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
