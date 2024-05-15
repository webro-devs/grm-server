import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CreateWithBaskerOrderDto {
  @ApiProperty({
    description: `price`,
    example: 1500,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @ApiProperty({
    description: `Plastic Sum`,
    example: 500,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly plasticSum: number;
}

export default CreateWithBaskerOrderDto;
