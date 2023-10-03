import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class UpdatePartiyaDto {
  @ApiProperty({
    description: `country`,
    example: 'Uzbekistan',
  })
  @IsOptional()
  @IsString()
  readonly country: string;

  @ApiProperty({
    description: `cost : Обошлось`,
    example: 8.56,
  })
  @IsOptional()
  @IsNumber()
  readonly quantity: number;

  @ApiProperty({
    description: `sum`,
    example: 40000,
  })
  @IsOptional()
  @IsNumber()
  readonly sum: number;

  @ApiProperty({
    description: `expense : Расход:`,
    example: 8000,
  })
  @IsOptional()
  @IsNumber()
  readonly expense: number;

  @ApiProperty({
    description: `date`,
    example: '2023-05-02 08:10:23.726769',
  })
  @IsOptional()
  @IsString()
  readonly date: string;
}

export default UpdatePartiyaDto;
