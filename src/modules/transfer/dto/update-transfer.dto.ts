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
    description: `title`,
    example: 'Create',
  })
  @IsOptional()
  @IsNumber()
  readonly count: number;

  @ApiProperty({
    description: `title`,
    example: 'Create',
  })
  @IsOptional()
  @IsString()
  readonly date: string;

  @ApiProperty({
    description: `title`,
    example: 'Create',
  })
  @IsOptional()
  @IsString()
  readonly from: string;

  @ApiProperty({
    description: `title`,
    example: 'Create',
  })
  @IsOptional()
  @IsString()
  readonly to: string;

  @ApiProperty({
    description: `title`,
    example: 'Create',
  })
  @IsOptional()
  @IsString()
  readonly product: string;

  @ApiProperty({
    description: `title`,
    example: 'Create',
  })
  @IsOptional()
  @IsString()
  readonly transferer: string;
}

export default UpdateTransferDto;
