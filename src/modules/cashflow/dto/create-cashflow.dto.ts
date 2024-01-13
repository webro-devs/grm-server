import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CashFlowEnum } from '../../../infra/shared/enum';
class CreateCashflowDto {
  @ApiProperty({
    description: `price`,
    example: '1600',
  })
  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @ApiProperty({
    description: `type`,
    example: 'Расход',
  })
  @IsNotEmpty()
  @IsString()
  readonly type: CashFlowEnum;

  @ApiProperty({
    description: `comment`,
    example: 'for lunch',
  })
  @IsOptional()
  @IsString()
  readonly comment: string;

  @ApiProperty({
    description: `title`,
    example: 'Магазин Расход',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly title: string;
}

export default CreateCashflowDto;
