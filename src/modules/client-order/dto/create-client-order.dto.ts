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
    description: `location`,
    example: 'London dark St 5',
  })
  @IsOptional()
  @IsString()
  readonly location: string;

  @ApiProperty({
    description: `location link`,
    example: 'https://meet.google.com/hrr-utnj-gcd',
  })
  @IsOptional()
  @IsString()
  readonly location_link: string;

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
