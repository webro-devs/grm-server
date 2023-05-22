import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class UpdateShapeDto {
  @ApiProperty({
    description: `title`,
    example: 'pentagon',
  })
  @IsOptional()
  @IsString()
  readonly title: string;
}
export default UpdateShapeDto;
