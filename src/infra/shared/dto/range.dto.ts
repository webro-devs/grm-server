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
}

export default RangeDto;
