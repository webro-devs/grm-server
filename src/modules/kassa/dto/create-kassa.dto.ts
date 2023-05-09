import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreateKassaDto {
  @ApiProperty({
    description: `filial id`,
    example: 'uuid',
  })
  @IsNotEmpty()
  @IsString()
  readonly filial: string;
}

export default CreateKassaDto;
