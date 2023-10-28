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
    description: `expense : Расход:`,
    example: 8000,
  })
  @IsOptional()
  @IsNumber()
  readonly expense: number;
}

export default UpdatePartiyaDto;
