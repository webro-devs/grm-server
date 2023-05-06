import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoleType } from '../../../infra/shared/type';
class CreateUserDto {
  @ApiProperty({
    description: `avatar`,
    example: 'https://image.png',
  })
  @IsNotEmpty()
  @IsString()
  readonly avatar: string;

  @ApiProperty({
    description: `Full name`,
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  readonly fullName: string;

  @ApiProperty({
    description: `login`,
    example: 'login',
  })
  @IsNotEmpty()
  @IsString()
  readonly login: string;

  @ApiProperty({
    description: `password`,
    example: 'password',
  })
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @ApiProperty({
    description: `role`,
    example: 1,
  })
  @IsNotEmpty()
  @IsString()
  readonly role: UserRoleType;
}

export default CreateUserDto;
