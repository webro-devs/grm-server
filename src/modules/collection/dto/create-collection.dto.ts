import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsOptional,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsUnique } from '../../../infra/shared/decorators/is-unique.decorator';
class CreateCollectionDto {
  @ApiProperty({
    description: `title`,
    example: 'SAG Carpets',
  })
  @IsNotEmpty()
  @IsString()
  @IsUnique('collection')
  readonly title: string;
}

export default CreateCollectionDto;
