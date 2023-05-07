import { IsNumber, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { UserRoleType } from '../../../infra/shared/type';
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
    example: 'abcd',
  })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({
    description: `User role`,
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  role: UserRoleType;

  constructor(user: ReturnUserDto) {
    this.sub = user.id;
    this.login = user.login;
    this.role = user.role;
  }
}

export default JwtPayloadDto;
