import { IsArray, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreateTransferDto {
  @ApiProperty({
    description: `title`,
    example: 'Create',
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;
}

export default CreateTransferDto;
