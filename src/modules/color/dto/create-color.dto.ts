import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsUnique } from 'src/infra/shared/decorators/is-unique.decorator';

class CreateColorDto {
  @ApiProperty({
    description: `title`,
    example: 'Red',
  })
  @IsNotEmpty()
  @IsString()
  @IsUnique('color')
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
