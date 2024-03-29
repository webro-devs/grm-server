import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreateTransferDto {
  @ApiProperty({
    description: `title`,
    example: 'Create',
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: `count`,
    example: 2,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly count: number;

  @ApiProperty({
    description: `from filial id`,
    example: 'uuid',
  })
  @IsNotEmpty()
  @IsString()
  readonly from: string;

  @ApiProperty({
    description: `to filial id`,
    example: 'uuid',
  })
  @IsNotEmpty()
  @IsString()
  readonly to: string;

  @ApiProperty({
    description: `product`,
    example: 'uuid',
  })
  @IsNotEmpty()
  @IsString()
  readonly product: string;
}

export default CreateTransferDto;
