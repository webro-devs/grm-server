import { IsNumber, IsOptional, IsString } from 'class-validator';
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
  @IsOptional()
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
    example: 'прочее',
  })
  @IsOptional()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: `kassa id`,
    example: 'uuid',
  })
  @IsOptional()
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

export default UpdateCashflowDto;
