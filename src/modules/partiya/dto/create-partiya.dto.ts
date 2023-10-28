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
    description: `expense : Расход:`,
    example: 8000,
  })
  @IsNumber()
  readonly expense: number;
}

export default CreatePartiyaDto;
