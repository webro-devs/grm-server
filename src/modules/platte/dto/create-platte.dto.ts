import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsUnique } from 'src/infra/shared/decorators/is-unique.decorator';

class CreatePlatteDto {
  @ApiProperty({
    description: `title`,
    example: 'Gulliy',
  })
  @IsNotEmpty()
  @IsString()
  @IsUnique('platte')
  readonly title: string;

  @ApiProperty({
    description: `code`,
    example: 'fe89',
  })
  @IsNotEmpty()
  @IsString()
  @IsUnique('platte')
  readonly code: string;
}

export default CreatePlatteDto;
