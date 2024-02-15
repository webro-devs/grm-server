import { IsArray, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
class CreateFilialDto {
  @ApiProperty({
    description: `title`,
    example: '',
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: `name`,
    example: '',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: `telegram link`,
    example: '',
  })
  @IsNotEmpty()
  @IsString()
  readonly telegram: string;

  @ApiProperty({
    description: `address`,
    example: '',
  })
  @IsNotEmpty()
  @IsString()
  readonly address: string;

  @ApiProperty({
    description: `address link`,
    example: '',
  })
  @IsNotEmpty()
  @IsString()
  readonly addressLink: string;

  @ApiProperty({
    description: `Landmark`,
    example: '',
  })
  @IsNotEmpty()
  @IsString()
  readonly landmark: string;

  @ApiProperty({
    description: `phone filial`,
    example: '+998',
  })
  @IsNotEmpty()
  @IsString()
  readonly phone1: string;

  @ApiProperty({
    description: `second phone filial`,
    example: '+998',
  })
  @IsNotEmpty()
  @IsString()
  readonly phone2: string;

  @ApiProperty({
    description: `Starting time`,
    example: '08:00',
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
