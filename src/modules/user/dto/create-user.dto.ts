import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoleType } from '../../../infra/shared/type';
class CreateUserDto {
  // @ApiProperty({
  //   description: `avatar`,
  //   example: 'https://image.png',
  // })
  // @IsOptional()
  // @IsString()
  // readonly avatar: string;

  @ApiProperty({
    description: `Firstname`,
    example: 'John',
  })
  @IsOptional()
  @IsString()
  readonly firstName: string;

  @ApiProperty({
    description: `Lastname`,
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  readonly lastName: string;

  // @ApiProperty({
  //   description: `login`,
  //   example: 'login',
  // })
  // @IsOptional()
  // @IsString()
  // readonly login: string;

  // @ApiProperty({
  //   description: `password`,
  //   example: 'password',
  // })
  // @IsOptional()
  // @IsString()
  // readonly password: string;

  @ApiProperty({
    description: `role`,
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly role: UserRoleType;

  @ApiProperty({
    description: `filial id`,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  readonly filial: string;

  @ApiProperty({
    description: `position id`,
    example: 'uuid',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly position: string;
}

export default CreateUserDto;
