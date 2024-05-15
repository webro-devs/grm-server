import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class UpdateBasketDto {
  @ApiProperty({
    description: `x`,
    example: 3,
  })
  @IsOptional()
  @IsNumber()
  readonly x: number;
}

export default UpdateBasketDto;
