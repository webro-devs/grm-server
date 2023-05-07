import { IsNotEmpty, IsString, IsObject, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import ReturnUserDto from './return-user.dto';

class ValidateUserDto {
  @ApiProperty({
    description: `Message of validation`,
    example: 'Hey Hey Hey I do not know',
  })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({
    description: `User Object`,
  })
  @IsOptional()
  @IsObject()
  body: ReturnUserDto | null;

  constructor(message: string, body: ReturnUserDto | null) {
    this.message = message;
    this.body = body;
  }
}

export default ValidateUserDto;
