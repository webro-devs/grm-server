import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CashFlowEnum } from '../../../infra/shared/enum';
class UpdateCashflowDto {
  @ApiProperty({
    description: `price`,
    example: '1600',
  })
  @IsOptional()
  @IsNumber()
  readonly price: number;

  @ApiProperty({
    description: `type`,
    example: 'Приход',
  })
  @IsNotEmpty()
  @IsString()
  readonly type: CashFlowEnum;

  @ApiProperty({
    description: `date`,
    example: '2023-05-02 08:10:23.726769',
  })
  @IsOptional()
  @IsString()
  readonly date: string;

  @ApiProperty({
    description: `comment`,
    example: 'for lunch',
  })
  @IsOptional()
  @IsString()
  readonly comment: string;

  @ApiProperty({
    description: `title`,
    example: 'Босс Расход',
  })
  @IsOptional()
  @IsString()
  readonly title: string;
}

export default UpdateCashflowDto;
