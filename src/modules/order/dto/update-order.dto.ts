import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class UpdateOrderDto {
  @ApiProperty({
    description: `product id`,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  readonly product: string;

  @ApiProperty({
    description: `price`,
    example: 1500,
  })
  @IsOptional()
  @IsNumber()
  readonly price: number;

  @ApiProperty({
    description: `date`,
    example: '2023-05-02 08:10:23.726769',
  })
  @IsOptional()
  @IsString()
  readonly date: string;
}

export default UpdateOrderDto;
