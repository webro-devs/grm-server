import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoleType } from '../../../infra/shared/type';
class UpdateClientDto {
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

  @ApiProperty({
    description: `avatar`,
    example: 'avatar',
  })
  @IsOptional()
  @IsString()
  readonly avatar: string;

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
}

export default UpdateClientDto;
