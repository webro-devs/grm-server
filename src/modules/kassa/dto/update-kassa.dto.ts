import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class UpdateKassaDto {
  @ApiProperty({
    description: `filial id`,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  readonly isActive: string;

  @ApiProperty({
    description: `end Date`,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  readonly endDate: string;
}

export default UpdateKassaDto;
