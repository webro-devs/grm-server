import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class UpdateQrBaseDto {
  @ApiProperty({
    description: `Qr code`,
    example: '123456789',
  })
  @IsOptional()
  @IsString()
  code: string;

  @ApiProperty({
    description: `Country`,
    example: 'UUID',
  })
  @IsOptional()
  @IsString()
  country: string;

  @ApiProperty({
    description: `Collection`,
    example: 'UUID',
  })
  @IsOptional()
  @IsString()
  collection: string;

  @ApiProperty({
    description: `Size`,
    example: 'UUID',
  })
  @IsOptional()
  @IsString()
  size: string;

  @ApiProperty({
    description: `Shape`,
    example: 'UUID',
  })
  @IsOptional()
  @IsString()
  shape: string;

  @ApiProperty({
    description: `Style`,
    example: 'UUID',
  })
  @IsOptional()
  @IsString()
  style: string;

  @ApiProperty({
    description: `color`,
    example: 'UUID',
  })
  @IsOptional()
  @IsString()
  color: string;

  @ApiProperty({
    description: `model`,
    example: 'UUID',
  })
  @IsOptional()
  @IsString()
  model: string;
}
export default UpdateQrBaseDto;
