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

  // @ApiProperty({
  //   description: `date`,
  //   example: '2023-05-02 08:10:23.726769',
  // })
  // @IsOptional()
  // @IsString()
  // readonly date: string;

  @ApiProperty({
    description: `comment`,
    example: 'for lunch',
  })
  @IsNotEmpty()
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

  @ApiProperty({
    description: `kassa id`,
    example: 'uuid',
  })
  @IsNotEmpty()
  @IsString()
  readonly kassa: string;

  @ApiProperty({
    description: `user id`,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  readonly casher: string;
}

export default CreateCashflowDto;
