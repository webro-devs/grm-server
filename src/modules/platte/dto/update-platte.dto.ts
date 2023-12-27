import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsUnique } from 'src/infra/shared/decorators/is-unique.decorator';

class UpdatePaletteDto {
  @ApiProperty({
    description: `palette title`,
    example: 'Hi-tech',
  })
  @IsOptional()
  @IsString()
  @IsUnique('palette')
  readonly title: string;
}

export default UpdatePaletteDto;
