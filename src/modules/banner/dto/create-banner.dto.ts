import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreateBannerDto {
  @ApiProperty({
    description: `Banner 1xx sm `,
    example: 'sadasd',
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: `Banner 1xx sm `,
    example: 'sadasd',
  })
  @IsNotEmpty()
  @IsString()
  readonly img: string;

  @ApiProperty({
    description: `index number`,
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly index: number;
}

export default CreateBannerDto;
