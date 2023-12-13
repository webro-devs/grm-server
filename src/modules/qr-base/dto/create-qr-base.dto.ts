import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreateQrBaseDto {
  @ApiProperty({
    description: `title`,
    example: 'pentagon',
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: `Qr code`,
    example: '13543154',
  })
  @IsNotEmpty()
  @IsString()
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
}

export default CreateQrBaseDto;
