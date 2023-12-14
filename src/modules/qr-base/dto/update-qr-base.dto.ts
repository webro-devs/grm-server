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
    example: 'Uzbekistan',
  })
  @IsOptional()
  @IsString()
  country: string;

  @ApiProperty({
    description: `Collection`,
    example: 'pentagon',
  })
  @IsOptional()
  @IsString()
  collection: string;

  @ApiProperty({
    description: `Size`,
    example: '200x300',
  })
  @IsOptional()
  @IsString()
  size: string;

  @ApiProperty({
    description: `Shape`,
    example: 'Pentagon',
  })
  @IsOptional()
  @IsString()
  shape: string;

  @ApiProperty({
    description: `Style`,
    example: 'Classic',
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
