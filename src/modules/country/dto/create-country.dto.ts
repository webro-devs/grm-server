import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreateCountryDto {
  @ApiProperty({
    description: `title`,
    example: 'classic',
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;
}

export default CreateCountryDto;
