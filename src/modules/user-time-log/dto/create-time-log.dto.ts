import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';

class CreateUserTimeLogDto {
  constructor() {
    if (!this.leave && !this.enter)
      throw new BadRequestException('Enter or leave do not be empty together!');
  }

  @ApiProperty({
    description: `enter`,
    example: 'time...',
    required: false,
  })
  @IsOptional()
  @IsDate()
  readonly enter: Date;

  @ApiProperty({
    description: `leave`,
    example: 'time...',
    required: false,
  })
  @IsOptional()
  @IsDate()
  readonly leave: Date;

  @ApiProperty({
    description: `leave`,
    example: 'time...',
  })
  @IsNotEmpty()
  @IsString()
  login: string;
}

export default CreateUserTimeLogDto;
