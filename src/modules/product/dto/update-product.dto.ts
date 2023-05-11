import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class UpdateProductDto {
  @ApiProperty({
    description: `Carpet code`,
    example: '2346290837462098',
  })
  @IsOptional()
  @IsString()
  code: string;

  @ApiProperty({
    description: `Carpet color`,
    example: 'yellow',
  })
  @IsOptional()
  @IsString()
  color: string;

  @ApiProperty({
    description: `Carpet count`,
    example: 3,
  })
  @IsOptional()
  @IsNumber()
  count: number;

  @ApiProperty({
    description: `Carpet image url`,
    example: 'https://carpet.jpg',
  })
  @IsOptional()
  @IsString()
  imgUrl: string;

  @ApiProperty({
    description: `Carpet price`,
    example: 140,
  })
  @IsOptional()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: `Carpet shape`,
    example: 'square',
  })
  @IsOptional()
  @IsString()
  shape: string;

  @ApiProperty({
    description: `Carpet size`,
    example: '2x3',
  })
  @IsOptional()
  @IsString()
  size: string;

  @ApiProperty({
    description: `Carpet style`,
    example: 'classic',
  })
  @IsOptional()
  @IsString()
  style: string;
}

export default UpdateProductDto;
