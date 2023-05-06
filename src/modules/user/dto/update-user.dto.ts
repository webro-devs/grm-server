import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoleType } from '../../../infra/shared/type';
class UpdateUserDto {
  @ApiProperty({
    description: `avatar`,
    example: 'https://image.png',
  })
  @IsOptional()
  @IsString()
  readonly avatar: string;

  @ApiProperty({
    description: `Full name`,
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  readonly fullName: string;

  @ApiProperty({
    description: `login`,
    example: 'login',
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
  readonly password: string;

  @ApiProperty({
    description: `role`,
    example: 1,
  })
  @IsOptional()
  @IsString()
  readonly role: UserRoleType;
}

export default UpdateUserDto;
