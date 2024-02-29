import { IsArray, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
class CreateModelDto {
  @ApiProperty({
    description: `title`,
    example: 'SAG Carpets',
  })
  @IsNotEmpty()
  @IsString()
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
