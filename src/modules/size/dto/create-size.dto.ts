import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsUnique } from 'src/infra/shared/decorators/is-unique.decorator';
class CreateSizeDto {
  @ApiProperty({
    description: `Carpet size 1xx sm `,
    example: '100x500',
  })
  @IsNotEmpty()
  @IsString()
  @IsUnique('size')
  readonly title: string;
}

export default CreateSizeDto;
