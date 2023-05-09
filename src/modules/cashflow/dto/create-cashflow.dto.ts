import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
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
    example: 'input',
  })
  @IsNotEmpty()
  @IsString()
  readonly type: string;

  @ApiProperty({
    description: `comment`,
    example: 'for lunch',
  })
  @IsNotEmpty()
  @IsString()
  readonly comment: string;

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
