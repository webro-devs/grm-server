import { IsOptional, IsString } from 'class-validator';
// import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
class UpdateOrderDto {
  @ApiProperty({
    description: `seller`,
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  readonly seller: string;

  @ApiProperty({
    description: `casher`,
    example: 'Jack Richard',
  })
  @IsOptional()
  @IsString()
  readonly casher: string;

  @ApiProperty({
    description: `price`,
    example: 1500,
  })
  @IsOptional()
  @IsString()
  readonly price: string;

  @ApiProperty({
    description: `date`,
    example: '15:32GTM5z',
  })
  @IsOptional()
  @IsString()
  readonly date: string;
}

export default UpdateOrderDto;
