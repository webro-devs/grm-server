import { IsOptional, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class UpdateInternetShopProductDto {
  @ApiProperty({
    description: `internetInfo`,
    example: '...',
  })
  @IsOptional()
  @IsArray()
  internetInfo: string[];
}

export default UpdateInternetShopProductDto;
