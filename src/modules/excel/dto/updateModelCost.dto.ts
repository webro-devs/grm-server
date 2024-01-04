import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class UpdateModelCostDto {
  @ApiProperty({
    description: `model id`,
    example: 'dfasasd-sdasda-das-aaDSASd',
  })
  @IsNotEmpty()
  @IsString()
  readonly modelId: string;

  @ApiProperty({
    description: `cost`,
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly cost: number;
}

export default UpdateModelCostDto;
