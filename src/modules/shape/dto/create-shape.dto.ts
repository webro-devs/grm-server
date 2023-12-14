import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsUnique } from 'src/infra/shared/decorators/is-unique.decorator';
class CreateShapeDto {
  @ApiProperty({
    description: `title`,
    example: 'pentagon',
  })
  @IsNotEmpty()
  @IsString()
  @IsUnique('shape')
  readonly title: string;
}

export default CreateShapeDto;
