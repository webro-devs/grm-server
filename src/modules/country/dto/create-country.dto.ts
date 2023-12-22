import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsUnique } from 'src/infra/shared/decorators/is-unique.decorator';
class CreateCountryDto {
  @ApiProperty({
    description: `title`,
    example: 'Uzbekistan',
  })
  @IsNotEmpty()
  @IsString()
  @IsUnique('country')
  readonly title: string;
}

export default CreateCountryDto;
