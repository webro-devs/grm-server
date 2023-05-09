import { IsArray, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
class UpdateCashflowDto {
  @ApiProperty({
    description: `price`,
    example: '1600',
  })
  @IsOptional()
  @IsString()
  readonly price: number;

  @ApiProperty({
    description: `type`,
    example: 'input',
  })
  @IsOptional()
  @IsString()
  readonly type: string;

  @ApiProperty({
    description: `comment`,
    example: 'for lunch',
  })
  @IsOptional()
  @IsString()
  readonly comment: string;

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
  readonly user: string;
}

export default UpdateCashflowDto;
