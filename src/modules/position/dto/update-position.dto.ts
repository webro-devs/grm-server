import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class UpdatePositionDto {
  @ApiProperty({
    description: `title`,
    example: 'Graphic design',
  })
  @IsOptional()
  @IsString()
  readonly title: string;
}
export default UpdatePositionDto;
