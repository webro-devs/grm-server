import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CreateMagazinInfoDto {
  @ApiProperty({
    description: `terms`,
    example: 'something...',
  })
  @IsOptional()
  @IsString()
  readonly terms: string;

  @ApiProperty({
    description: `availability`,
    example: 'something...',
  })
  @IsOptional()
  @IsString()
  readonly availability: string;

  @ApiProperty({
    description: `start time`,
    example: '21:00',
  })
  @IsOptional()
  @IsString()
  readonly start_time: string;

  @ApiProperty({
    description: `end time`,
    example: '22:00',
  })
  @IsOptional()
  @IsString()
  readonly end_time: string;

  @ApiProperty({
    description: `count`,
    example: '1',
  })
  @IsOptional()
  @IsNumber()
  readonly count: number;

  @ApiProperty({
    description: `Allowed`,
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  readonly allowed: boolean;
}

export default CreateMagazinInfoDto;
