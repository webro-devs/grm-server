import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class UpdateTransferDto {
  @ApiProperty({
    description: `title`,
    example: 'Create',
  })
  @IsOptional()
  @IsString()
  readonly title: string;
}

export default UpdateTransferDto;
