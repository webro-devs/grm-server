import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class ImportExcelDto {
  @ApiProperty({
    description: `Excel file`,
    example: 'file',
    type: 'string',
    format: 'binary',
  })
  readonly file: Express.Multer.File;

  @ApiProperty({
    description: `partiya id`,
    example: 'uuid',
  })
  @IsNotEmpty()
  @IsString()
  readonly partiyaId: string;
}

export default ImportExcelDto;
