import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class UpdateClientOrderDto {
  @ApiProperty({
    description: `name`,
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  readonly firstName: string;

  @ApiProperty({
    description: `location`,
    example: 'London',
  })
  @IsOptional()
  @IsString()
  readonly lastName: string;

  @ApiProperty({
    description: `number`,
    example: '+998998887766',
  })
  @IsOptional()
  @IsString()
  readonly phone: string;

  @ApiProperty({
    description: `is delevery`,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  readonly delivery: string;

  @ApiProperty({
    description: `City`,
    example: 'London',
  })
  @IsOptional()
  @IsString()
  readonly city: string;

  @ApiProperty({
    description: `Region`,
    example: 'Walk street',
  })
  @IsOptional()
  @IsString()
  readonly region: string;

  @ApiProperty({
    description: `Street`,
    example: '4-corner',
  })
  @IsOptional()
  @IsString()
  readonly street: string;

  @ApiProperty({
    description: `House`,
    example: '4-h',
  })
  @IsOptional()
  @IsString()
  readonly house: string;

  @ApiProperty({
    description: `comment`,
    example: '......',
  })
  @IsOptional()
  @IsString()
  readonly comment: string;

  @ApiProperty({
    description: `Date`,
    example: '2022-11-23',
  })
  @IsOptional()
  @IsString()
  readonly date: string;

  @ApiProperty({
    description: `count`,
    example: 2,
  })
  @IsOptional()
  @IsNumber()
  readonly count: number;

  @ApiProperty({
    description: `filial`,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  readonly filial: string;
}

export default UpdateClientOrderDto;
