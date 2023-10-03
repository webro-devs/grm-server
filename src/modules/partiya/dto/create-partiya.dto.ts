import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreatePartiyaDto {
  @ApiProperty({
    description: `country`,
    example: 'Uzbekistan',
  })
  @IsNotEmpty()
  @IsString()
  readonly country: string;

  @ApiProperty({
    description: `Обём : 1000²`,
    example: 1000,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly quantity: number;

  @ApiProperty({
    description: `sum`,
    example: 40000,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly sum: number;

  @ApiProperty({
    description: `expense : Расход:`,
    example: 8000,
  })
  @IsNotEmpty()
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

export default CreatePartiyaDto;
