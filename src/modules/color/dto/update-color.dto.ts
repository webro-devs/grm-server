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
}

export default UpdateColorDto;
