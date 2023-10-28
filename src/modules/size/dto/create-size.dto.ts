import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreateSizeDto {
  @ApiProperty({
    description: `Carpet size 1xx sm `,
    example: '100x500',
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;
}

export default CreateSizeDto;
