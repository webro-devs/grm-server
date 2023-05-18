import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { ReturnUserDto } from './index';

class JwtPayloadDto {
  @ApiProperty({
    description: `User id`,
    example: 'sdawdadewsdewd2132seewq',
  })
  @IsNotEmpty()
  @IsString()
  sub: string;

  @ApiProperty({
    description: `User login`,
    example: 'admin',
  })
  @IsNotEmpty()
  @IsString()
  login: string;

  constructor(user: ReturnUserDto) {
    this.sub = user.id;
    this.login = user.login;
  }
}

export default JwtPayloadDto;
