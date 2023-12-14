import { IsArray, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsUnique } from 'src/infra/shared/decorators/is-unique.decorator';
class UpdateCollectionDto {
  @ApiProperty({
    description: `title`,
    example: 'SAG Carpets',
  })
  @IsOptional()
  @IsString()
  @IsUnique('color')
  readonly title: string;
}

export default UpdateCollectionDto;
