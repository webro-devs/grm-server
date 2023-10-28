import { ApiProperty } from '@nestjs/swagger';
class ImportExcelDto {
  @ApiProperty({
    description: `Excel file`,
    example: 'file',
    type: 'string',
    format: 'binary',
  })
  readonly file?: any;
}

export default ImportExcelDto;
