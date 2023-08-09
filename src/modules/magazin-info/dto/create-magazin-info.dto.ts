import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreateMagazinInfoDto {
  @ApiProperty({
    description: `terms`,
    example: 'something...',
  })
  @IsOptional()
  @IsString()
  readonly terms: string;

  @ApiProperty({
    description: `availability`,
    example: 'something...',
  })
  @IsOptional()
  @IsString()
  readonly availability: string;
}

export default CreateMagazinInfoDto;
