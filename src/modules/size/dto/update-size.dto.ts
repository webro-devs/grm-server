import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class UpdateSizeDto {
  @ApiProperty({
    description: `Carpet size 1..sm`,
    example: 'title: 100x500',
  })
  @IsOptional()
  @IsString()
  readonly title: string;
}

export default UpdateSizeDto;
