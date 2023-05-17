import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class GetKassaByRangeDto {
  @ApiProperty({
    description: `filial id`,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  readonly filial: string;

  @ApiProperty({
    description: `Start Date`,
    example: '2023-05-02 08:10:23.726769',
  })
  @IsOptional()
  @IsString()
  readonly startDate: string;

  @ApiProperty({
    description: `end Date`,
    example: '2023-05-02 08:10:23.726769',
  })
  @IsOptional()
  @IsString()
  readonly endDate: string;
}

export default GetKassaByRangeDto;
