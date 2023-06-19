import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
class UpdateFileDto {
  @ApiProperty({
    description: `Model`,
    example: 5465,
  })
  @IsOptional()
  @IsString()
  readonly model: string;

  @ApiProperty({
    description: `Color`,
    example: 'Yellow',
  })
  @IsOptional()
  @IsString()
  readonly color: string;

  @ApiProperty({
    description: `Url`,
    example: 'https://grm.uz/example.jpg',
  })
  @IsOptional()
  @IsString()
  readonly url: string;
}

export default UpdateFileDto;
