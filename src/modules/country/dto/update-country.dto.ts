import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class UpdateCountryDto {
  @ApiProperty({
    description: `title`,
    example: 'classic',
  })
  @IsOptional()
  @IsString()
  readonly title: string;
}
export default UpdateCountryDto;
