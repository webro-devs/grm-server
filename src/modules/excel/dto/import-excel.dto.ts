import { IsNotEmpty, } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class ImportExcelDto {
  @ApiProperty({
    description: `Excel file`,
    example: 'file',
    type: 'string',
    format: 'binary',
  })
  @IsNotEmpty()
  readonly file: Express.Multer.File;
}

export default ImportExcelDto;
