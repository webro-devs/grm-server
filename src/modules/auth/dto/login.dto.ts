import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

class LoginDto {
  @ApiProperty({
    description: `User's login`,
    example: 'abcd',
  })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({
    description: `User's password`,
    example: 'Rakufo4inC00lGuy',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export default LoginDto;
