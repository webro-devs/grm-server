import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreateClientRequestDto {
  @ApiProperty({
    description: `name`,
    example: 'Mike Tyson',
  })
  @IsOptional()
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: `location`,
    example: 'Berlin',
  })
  @IsOptional()
  @IsString()
  readonly location: string;

  @ApiProperty({
    description: `number`,
    example: '+998998887766',
  })
  @IsOptional()
  @IsString()
  readonly phone: string;
}

export default CreateClientRequestDto;
