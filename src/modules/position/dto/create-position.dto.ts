import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreatePositionDto {
  @ApiProperty({
    description: `title`,
    example: 'Backend developer',
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;
}

export default CreatePositionDto;
