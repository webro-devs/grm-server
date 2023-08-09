import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreateClientRequestDto {
  @ApiProperty({
    description: `name`,
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: `location`,
    example: 'London',
  })
  @IsNotEmpty()
  @IsString()
  readonly location: string;

  @ApiProperty({
    description: `number`,
    example: '+998998887766',
  })
  @IsNotEmpty()
  @IsString()
  readonly phone: string;
}

export default CreateClientRequestDto;
