import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreateClientOrderDto {
  @ApiProperty({
    description: `FirstName`,
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @ApiProperty({
    description: `LastName`,
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @ApiProperty({
    description: `phone`,
    example: '+998998887766',
  })
  @IsNotEmpty()
  @IsString()
  readonly phone: string;

  @ApiProperty({
    description: `is delivery`,
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  readonly delivery: boolean;

  @ApiProperty({
    description: `Delivery sum`,
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  readonly deliverySum: number;

  @ApiProperty({
    description: `Total price`,
    example: 1000,
  })
  @IsOptional()
  @IsNumber()
  readonly totalPrice: number;

  @ApiProperty({
    description: `City`,
    example: 'London',
  })
  @IsOptional()
  @IsString()
  readonly city: string;

  @ApiProperty({
    description: `Region`,
    example: 'Walk street',
  })
  @IsOptional()
  @IsString()
  readonly region: string;

  @ApiProperty({
    description: `Street`,
    example: '4-corner',
  })
  @IsOptional()
  @IsString()
  readonly street: string;

  @ApiProperty({
    description: `House`,
    example: '4-h',
  })
  @IsOptional()
  @IsString()
  readonly house: string;

  @ApiProperty({
    description: `comment`,
    example: '......',
  })
  @IsOptional()
  @IsString()
  readonly comment: string;

  @ApiProperty({
    description: `Date`,
    example: '2022-11-23',
  })
  @IsOptional()
  @IsString()
  readonly date: string;

  @ApiProperty({
    description: `filial`,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  filial: string;

  @ApiProperty({
    description: `user`,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  user: string;

  @ApiProperty({
    description: `order`,
    example: [
      { id: 'uuid', count: 5 },
      { id: 'uuid', count: 10 },
    ],
  })
  @IsOptional()
  @IsArray()
  order: { id: string; count: number }[];
}

export default CreateClientOrderDto;
