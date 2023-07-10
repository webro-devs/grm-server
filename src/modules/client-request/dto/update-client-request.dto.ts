import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreateClientRequestDto {
  @ApiProperty({
    description: `name`,
    example: 'pentagon',
  })
  @IsOptional()
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: `location`,
    example: 'pentagon',
  })
  @IsOptional()
  @IsString()
  readonly location: string;

  @ApiProperty({
    description: `number`,
    example: 'pentagon',
  })
  @IsOptional()
  @IsString()
  readonly number: string;
}

export default CreateClientRequestDto;
