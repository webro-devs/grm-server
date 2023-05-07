import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class RefreshTokenDto {
  @ApiProperty({
    description: `Refresh Token`,
    example: '21jnqwdbqawdjaj32s',
  })
  @IsNotEmpty()
  @IsString()
  readonly refreshToken: string;
}

export default RefreshTokenDto;
