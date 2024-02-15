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
    description: `name`,
    example: 'ozimizi filiallar nomi',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: `address`,
    example: 'Aloqa markazi',
  })
  @IsNotEmpty()
  @IsString()
  readonly address: string;

  @ApiProperty({
    description: `address link`,
    example: 'https://maps.app.goo.gl/KHo1x8cn5fMmXpAE6',
  })
  @IsNotEmpty()
  @IsString()
  readonly addressLink: string;

  @ApiProperty({
    description: `Landmark`,
    example: 'Aloqa markazi',
  })
  @IsNotEmpty()
  @IsString()
  readonly landmark: string;

  @ApiProperty({
    description: `phone filial`,
    example: '+99891 111 22 33',
  })
  @IsNotEmpty()
  @IsString()
  readonly phone1: string;

  @ApiProperty({
    description: `second phone filial`,
    example: '+99892 111 22 33',
  })
  @IsNotEmpty()
  @IsString()
  readonly phone2: string;

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
