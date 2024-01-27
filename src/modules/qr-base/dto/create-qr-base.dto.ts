import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsUnique } from 'src/infra/shared/decorators/is-unique.decorator';
class CreateQrBaseDto {
  @ApiProperty({
    description: `Qr code`,
    example: '123456789',
  })
  @IsNotEmpty()
  @IsString()
  @IsUnique('qrbase')
  code: string;

  @ApiProperty({
    description: `Country`,
    example: 'UUID',
  })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty({
    description: `Collection`,
    example: 'UUID',
  })
  @IsNotEmpty()
  @IsString()
  collection: string;

  @ApiProperty({
    description: `Size`,
    example: 'UUID',
  })
  @IsNotEmpty()
  @IsString()
  size: string;

  @ApiProperty({
    description: `Shape`,
    example: 'UUID',
  })
  @IsNotEmpty()
  @IsString()
  shape: string;

  @ApiProperty({
    description: `Style`,
    example: 'UUID',
  })
  @IsNotEmpty()
  @IsString()
  style: string;

  @ApiProperty({
    description: `color`,
    example: 'UUID',
  })
  @IsNotEmpty()
  @IsString()
  color: string;

  @ApiProperty({
    description: `model`,
    example: 'UUID',
  })
  @IsNotEmpty()
  @IsString()
  model: string;

  @IsOptional()
  @IsNumber()
  count?: number;
}

export default CreateQrBaseDto;
