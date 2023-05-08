import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
// import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
class CreateOrderDto {
  @ApiProperty({
    description: `seller`,
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  readonly seller: string;

  @ApiProperty({
    description: `casher`,
    example: 'Jack Richard',
  })
  @IsNotEmpty()
  @IsString()
  readonly casher: string;

  @ApiProperty({
    description: `price`,
    example: 1500,
  })
  @IsNotEmpty()
  @IsString()
  readonly price: string;

  @ApiProperty({
    description: `date`,
    example: '15:32GTM5z',
  })
  @IsNotEmpty()
  @IsString()
  readonly date: string;
}

export default CreateOrderDto;
