import { IsArray, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
class CreateFilialDto {
  @ApiProperty({
    description: `title`,
    example: 'Carpet center',
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: `address`,
    example: 'Tashkent',
  })
  @IsNotEmpty()
  @IsString()
  readonly address: string;

  @ApiProperty({
    description: `Starting time`,
    example: '9:00',
  })
  @IsNotEmpty()
  @IsString()
  readonly startWorkTime: string;

  @ApiProperty({
    description: `Ending time`,
    example: '18:00',
  })
  @IsNotEmpty()
  @IsString()
  readonly endWorkTime: string;
}

export default CreateFilialDto;
