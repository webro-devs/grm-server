import { IsArray, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsUnique } from 'src/infra/shared/decorators/is-unique.decorator';
class CreateModelDto {
  @ApiProperty({
    description: `title`,
    example: 'SAG Carpets',
  })
  @IsNotEmpty()
  @IsString()
  @IsUnique('model')
  readonly title: string;

  @ApiProperty({
    description: `collection UUID`,
    example: 'UUID',
  })
  @IsNotEmpty()
  @IsString()
  readonly collection: string;
}

export default CreateModelDto;
