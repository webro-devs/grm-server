import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class UpdateBannerDto {
  @ApiProperty({
    description: `Banner 1..sm`,
    example: 'sdadasds',
  })
  @IsOptional()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: `Banner 1..sm`,
    example: 'sdadasds',
  })
  @IsOptional()
  @IsString()
  readonly img: string;
}

export default UpdateBannerDto;
