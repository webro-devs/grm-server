import { IsArray, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
class UpdateFilialDto {
  @ApiProperty({
    description: `title`,
    example: 'Carpet center',
  })
  @IsOptional()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: `address`,
    example: 'Tashkent',
  })
  @IsOptional()
  @IsString()
  readonly address: string;
}

export default UpdateFilialDto;
