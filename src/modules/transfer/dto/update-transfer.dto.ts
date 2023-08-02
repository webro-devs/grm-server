import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class UpdateTransferDto {
  @ApiProperty({
    description: `title`,
    example: 'Create',
  })
  @IsOptional()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: `count`,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  readonly count: number;

  @ApiProperty({
    description: `date`,
    example: '2022-10-14',
  })
  @IsOptional()
  @IsString()
  readonly date: string;

  @ApiProperty({
    description: `from filial id`,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  readonly from: string;

  @ApiProperty({
    description: `to filial id`,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  readonly to: string;

  @ApiProperty({
    description: `product`,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  readonly product: string;

  @ApiProperty({
    description: `transferer`,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  readonly transferer: string;
}

export default UpdateTransferDto;
