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
    description: `title`,
    example: 'Create',
  })
  @IsNotEmpty()
  @IsNumber()
  readonly count: number;

  @ApiProperty({
    description: `title`,
    example: 'Create',
  })
  @IsNotEmpty()
  @IsString()
  readonly date: string;

  @ApiProperty({
    description: `title`,
    example: 'Create',
  })
  @IsNotEmpty()
  @IsString()
  readonly from: string;

  @ApiProperty({
    description: `title`,
    example: 'Create',
  })
  @IsNotEmpty()
  @IsString()
  readonly to: string;

  @ApiProperty({
    description: `title`,
    example: 'Create',
  })
  @IsNotEmpty()
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

export default CreateTransferDto;
