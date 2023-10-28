import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreateColorDto {
  @ApiProperty({
    description: `title`,
    example: 'Red',
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: `code`,
    example: '#fe2389',
  })
  @IsNotEmpty()
  @IsString()
  readonly code: string;
}

export default CreateColorDto;
