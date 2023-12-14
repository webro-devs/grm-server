import { IsNotEmpty, IsString } from 'class-validator';
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
    example: 'Uzbekistan',
  })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty({
    description: `Collection`,
    example: 'pentagon',
  })
  @IsNotEmpty()
  @IsString()
  collection: string;

  @ApiProperty({
    description: `Size`,
    example: '200x300',
  })
  @IsNotEmpty()
  @IsString()
  size: string;

  @ApiProperty({
    description: `Shape`,
    example: 'Pentagon',
  })
  @IsNotEmpty()
  @IsString()
  shape: string;

  @ApiProperty({
    description: `Style`,
    example: 'Classic',
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
}

export default CreateQrBaseDto;
