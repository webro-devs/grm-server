import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class UpdateColorDto {
  @ApiProperty({
    description: `color title`,
    example: 'Yellow',
  })
  @IsOptional()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: `color code`,
    example: '#fe2389',
  })
  @IsOptional()
  @IsString()
  readonly code: string;
}

export default UpdateColorDto;
