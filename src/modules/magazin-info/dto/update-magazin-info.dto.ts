import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class UpdateMagazinInfoDto {
  @ApiProperty({
    description: `terms`,
    example: 'Something...',
  })
  @IsNotEmpty()
  @IsString()
  readonly terms: string;

  @ApiProperty({
    description: `availability`,
    example: 'Something...',
  })
  @IsNotEmpty()
  @IsString()
  readonly availability: string;
}

export default UpdateMagazinInfoDto;
