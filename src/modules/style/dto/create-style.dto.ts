import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsUnique } from 'src/infra/shared/decorators/is-unique.decorator';
class CreateStyleDto {
  @ApiProperty({
    description: `title`,
    example: 'classic',
  })
  @IsNotEmpty()
  @IsString()
  @IsUnique('style')
  readonly title: string;
}

export default CreateStyleDto;
