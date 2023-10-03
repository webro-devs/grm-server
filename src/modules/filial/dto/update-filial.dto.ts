import { IsOptional, IsString } from 'class-validator';
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
    example: 'Toshmi',
  })
  @IsOptional()
  @IsString()
  readonly address: string;

  @ApiProperty({
    description: `address link`,
    example: 'https://maps.app.goo.gl/KHo1x8cn5fMmXpAE6',
  })
  @IsOptional()
  @IsString()
  readonly addressLink: string;

  @ApiProperty({
    description: `landmark`,
    example: 'Malika bozori',
  })
  @IsOptional()
  @IsString()
  readonly landmark: string;

  @ApiProperty({
    description: `phone filial`,
    example: '+998 91 112 23 34',
  })
  @IsOptional()
  @IsString()
  readonly phone1: string;

  @ApiProperty({
    description: `second phone filial`,
    example: '+998 92 223 34 45',
  })
  @IsOptional()
  @IsString()
  readonly phone2: string;

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
