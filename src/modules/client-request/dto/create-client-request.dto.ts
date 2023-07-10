import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreateClientRequestDto {
  @ApiProperty({
    description: `name`,
    example: 'pentagon',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: `location`,
    example: 'pentagon',
  })
  @IsNotEmpty()
  @IsString()
  readonly location: string;

  @ApiProperty({
    description: `number`,
    example: 'pentagon',
  })
  @IsNotEmpty()
  @IsString()
  readonly number: string;
}

export default CreateClientRequestDto;
