import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreateProductDto {
  @ApiProperty({
    description: `Carpet color`,
    example: 'yellow',
  })
  @IsNotEmpty()
  @IsString()
  color: string;

  @ApiProperty({
    description: `Carpet count`,
    example: 3,
  })
  @IsNotEmpty()
  @IsNumber()
  count: number;

  @ApiProperty({
    description: `Carpet image url`,
    example: 'https://carpet.jpg',
  })
  @IsNotEmpty()
  @IsString()
  imgUrl: string;

  @ApiProperty({
    description: `Carpet price`,
    example: 140,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: `Carpet shape`,
    example: 'square',
  })
  @IsNotEmpty()
  @IsString()
  shape: string;

  @ApiProperty({
    description: `Carpet size`,
    example: '2x3',
  })
  @IsNotEmpty()
  @IsString()
  size: string;

  @ApiProperty({
    description: `Carpet style`,
    example: 'classic',
  })
  @IsNotEmpty()
  @IsString()
  style: string;
}

export default CreateProductDto;
