import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class UpdatePartiyaDto {
  @ApiProperty({
    description: `country`,
    example: 'Uzbekistan',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly country?: string;

  @ApiProperty({
    description: `title`,
    example: 'Better uchun',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly title?: string;

  @ApiProperty({
    description: `expense : Расход:`,
    example: 8000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  readonly expense?: number;

  @ApiProperty({
    description: `already sended`,
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  readonly check?: boolean;
}

export default UpdatePartiyaDto;
