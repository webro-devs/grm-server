import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreateColorDto {
  @ApiProperty({
    description: `Carpet size 1..sm `,
    example: 'title: 100x500',
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;
}

export default CreateColorDto;
