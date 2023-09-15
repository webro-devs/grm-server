import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class UpdateExcelDto {
  @ApiProperty({
    description: `data excel file`,
    example: '[ {...}, {...} ]',
  })
  readonly datas: Array<object>;

  @ApiProperty({
    description: `filial id`,
    example: 'uuid',
  })
  @IsNotEmpty()
  @IsString()
  readonly filialId: string;
}

export default UpdateExcelDto;
