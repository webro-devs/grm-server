import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsUnique } from 'src/infra/shared/decorators/is-unique.decorator';

class CreatePaletteDto {
  @ApiProperty({
    description: `title`,
    example: 'Gulliy',
  })
  @IsNotEmpty()
  @IsString()
  @IsUnique('palette')
  readonly title: string;
}

export default CreatePaletteDto;
