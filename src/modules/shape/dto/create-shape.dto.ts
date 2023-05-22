import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreateShapeDto {
  @ApiProperty({
    description: `title`,
    example: 'pentagon',
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;
}

export default CreateShapeDto;
