import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoleType } from '../../../infra/shared/type';
import { hashPassword } from '../../../infra/helpers';

class UpdateUserDto {
  @ApiProperty({
    description: `avatar`,
    example: 'https://image.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly avatar: string;

  @ApiProperty({
    description: `Firstname`,
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly firstName: string;

  @ApiProperty({
    description: `Lastname`,
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly lastName: string;

  @ApiProperty({
    description: `login`,
    example: 'login',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly login: string;

  @ApiProperty({
    description: `password`,
    example: 'password',
  })
  @IsOptional()
  @IsString()
  password: string;

  @ApiProperty({
    description: `role`,
    example: 1,
  })
  @IsOptional()
  @IsString()
  readonly role: UserRoleType;

  @ApiProperty({
    description: `filial id`,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  readonly filial: string;

  @ApiProperty({
    description: `email`,
    example: 'example@gmail.com',
  })
  @IsOptional()
  @IsString()
  readonly email: string;

  @ApiProperty({
    description: `phone`,
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  readonly phone: string;

  @ApiProperty({
    description: `position id`,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  readonly position: string;

  constructor() {
    (async () => {
      if (this.login) {
        this.password = await hashPassword(this.login);
      }
    })();
  }
}

export default UpdateUserDto;
