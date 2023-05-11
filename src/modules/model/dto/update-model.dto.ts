import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class UpdateModelDto {
  @ApiProperty({
    description: `title`,
    example: 'SAG Carpets',
  })
  @IsOptional()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: `collection UUID`,
    example: 'UUID',
  })
  @IsOptional()
  @IsString()
  readonly collection: string;
}

export default UpdateModelDto;
