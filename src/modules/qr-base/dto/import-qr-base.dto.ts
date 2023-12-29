import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
class ImportQrBaselDto {
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
    required: false,
  })
  @IsString()
  readonly partiyaId: string;
}

export default ImportQrBaselDto;
