import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
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
