import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class UpdateActionDto {
  @ApiProperty({
    description: `color title`,
    example: 'Yellow',
  })
  @IsOptional()
  @IsString()
  readonly title: string;
}

export default UpdateActionDto;
