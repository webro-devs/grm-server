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

  @ApiProperty({
    description: `Starting time`,
    example: '9:00',
  })
  @IsOptional()
  @IsString()
  readonly startWorkTime: string;

  @ApiProperty({
    description: `Ending time`,
    example: '18:00',
  })
  @IsOptional()
  @IsString()
  readonly endWorkTime: string;
}

export default UpdateFilialDto;
