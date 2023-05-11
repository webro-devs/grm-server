import { IsArray, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
class ImportFileDto {
  @ApiProperty({
    description: `Excel file`,
    example: 'file',
    type: 'string',
    format: 'binary',
  })
  @IsNotEmpty()
  readonly file: Express.Multer.File;
}

export default ImportFileDto;
