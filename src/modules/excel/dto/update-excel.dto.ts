import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/modules/product/product.entity';
class UpdateExcelDto {
  @ApiProperty({
    description: `data excel file`,
    example: '[ {...}, {...} ]',
  })
  readonly datas: Product[];

  @ApiProperty({
    description: `filial id`,
    example: 'uuid',
  })
  @IsNotEmpty()
  @IsString()
  readonly filialId: string;
}

export default UpdateExcelDto;
