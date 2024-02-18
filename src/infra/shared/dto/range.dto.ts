import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class RangeDto {
  @ApiProperty({
    description: `startDate`,
    example: '2023-06-21',
  })
  @IsOptional()
  readonly startDate: string;

  @ApiProperty({
    description: `endDate`,
    example: '2023-06-26',
  })
  @IsOptional()
  readonly endDate: string;

  @ApiProperty({
    description: `total`,
    example: 'false',
    required: false,
  })
  @IsOptional()
  readonly total: string;

  @ApiProperty({
    description: `filial`,
    example: 'false',
    required: false,
  })
  @IsOptional()
  readonly filial: string;
}

export default RangeDto;
