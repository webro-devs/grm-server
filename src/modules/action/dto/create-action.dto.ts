import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreateActionDto {
  @ApiProperty({
    description: `user id`,
    example: 'UUID',
  })
  @IsNotEmpty()
  @IsString()
  readonly user: string;

  @ApiProperty({
    description: `filial id`,
    example: 'UUID',
  })
  @IsNotEmpty()
  @IsString()
  readonly filial: string;

  @ApiProperty({
    description: `Type`,
    example: 'sell product',
  })
  @IsNotEmpty()
  @IsString()
  readonly type: string;

  @ApiProperty({
    description: `Desc`,
    example: 'product sold > ...',
  })
  @IsNotEmpty()
  @IsString()
  readonly desc: string;

  @ApiProperty({
    description: `info`,
    example: 'object',
  })
  @IsNotEmpty()
  @IsObject()
  readonly info: object;
}

export default CreateActionDto;
