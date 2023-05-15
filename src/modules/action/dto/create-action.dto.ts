import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreateActionDto {
  @ApiProperty({
    description: `title`,
    example: 'Create',
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;
}

export default CreateActionDto;
