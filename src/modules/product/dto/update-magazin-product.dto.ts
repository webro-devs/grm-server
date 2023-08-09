import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class UpdateMagazinProductDto {
  @ApiProperty({
    description: `Carpet model id`,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  weight: string;

  @ApiProperty({
    description: `Carpet model id`,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  pileHeight: string;

  @ApiProperty({
    description: `Carpet model id`,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  basedDensity: string;

  @ApiProperty({
    description: `Carpet model id`,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  weftdensity: string;

  @ApiProperty({
    description: `Carpet model id`,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  pileDensity: string;

  @ApiProperty({
    description: `Carpet model id`,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  manufacturer: string;

  @ApiProperty({
    description: `Carpet model id`,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  dorsalMaterial: string;

  @ApiProperty({
    description: `Carpet model id`,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  style: string;
}

export default UpdateMagazinProductDto;
