import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreateClientDto {
  @ApiProperty({
    description: `Login`,
    example: 'login',
  })
  @IsOptional()
  @IsString()
  login: string;

  @ApiProperty({
    description: `password`,
    example: 'password',
  })
  @IsOptional()
  @IsString()
  password: string;
}

export default CreateClientDto;
