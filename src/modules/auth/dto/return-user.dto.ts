import {
  IsNumber,
  IsNotEmpty,
  IsString,
  IsEmail,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { UserRoleType } from '../../../infra/shared/type';
import { User } from '../../user/user.entity';

class ReturnUser {
  @ApiProperty({
    description: `Firstname`,
    example: 'Petr',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  fullName: string;

  @ApiProperty({
    description: `User Email`,
    example: 'phone.petr@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  login: string;

  @ApiProperty({
    description: `User id`,
    example: 'sdawdadewsdewd2132seewq',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    description: `User role`,
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  role: UserRoleType;

  constructor(user: User) {
    this.id = user.id;
    this.fullName = user.fullName;
    this.login = user.login;
    this.role = user.role;
  }
}

export default ReturnUser;
