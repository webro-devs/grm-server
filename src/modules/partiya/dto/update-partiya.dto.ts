import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class UpdatePartiyaDto {
  @ApiProperty({
    description: `country`,
    example: 'Uzbekistan',
  })
  @IsOptional()
  @IsString()
  readonly country: string;

  @ApiProperty({
    description: `cost : Обошлось`,
    example: 8.56,
  })
  @IsOptional()
  @IsNumber()
  readonly cost: number;

  @ApiProperty({
    description: `date`,
    example: '2023-05-02 08:10:23.726769',
  })
  @IsOptional()
  @IsString()
  readonly date: string;

  @ApiProperty({
    description: `expense : Расход:`,
    example: 8000,
  })
  @IsOptional()
  @IsNumber()
  readonly expense: number;

  @ApiProperty({
    description: `order quantity : Обём заказа:`,
    example: 1000 + 'm^2',
  })
  @IsOptional()
  @IsNumber()
  readonly orderQuantity: number;

  @ApiProperty({
    description: `price : Цена`,
    example: 8,
  })
  @IsOptional()
  @IsNumber()
  readonly price: number;

  @ApiProperty({
    description: `sum`,
    example: 40000,
  })
  @IsOptional()
  @IsNumber()
  readonly sum: number;
}

export default UpdatePartiyaDto;
