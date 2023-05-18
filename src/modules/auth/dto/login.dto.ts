import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

class LoginDto {
  @ApiProperty({
    description: `Admin's login`,
    example: 'admin',
  })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({
    description: `Admin's password`,
    example: 'Rakufo4inC00lGuy',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export default LoginDto;
