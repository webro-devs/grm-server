import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class UpdateActionDto {
  @ApiProperty({
    description: `title`,
    example: 'Create',
  })
  @IsOptional()
  @IsString()
  readonly title: string;
}

export default UpdateActionDto;
