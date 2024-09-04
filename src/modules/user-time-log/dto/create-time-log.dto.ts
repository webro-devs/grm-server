import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CreateUserTimeLogDto {
  @ApiProperty({
    description: `enter`,
    example: 'time...',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  date: Date;

  @ApiProperty({
    description: `leave`,
    example: 'time...',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  login: string;
}

export default CreateUserTimeLogDto;
