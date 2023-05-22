import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreateColorDto {
  @ApiProperty({
    description: `color title`,
    example: 'Red',
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;
}

export default CreateColorDto;
