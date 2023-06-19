import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreateFileDto {
  @ApiProperty({
    description: `Model`,
    example: 5465,
  })
  @IsNotEmpty()
  @IsString()
  readonly model: string;

  @ApiProperty({
    description: `Color`,
    example: 'Yellow',
  })
  @IsNotEmpty()
  @IsString()
  readonly color: string;

  @ApiProperty({
    description: `Url`,
    example: 'https://grm.uz/example.jpg',
  })
  @IsNotEmpty()
  @IsString()
  readonly url: string;
}

export default CreateFileDto;
