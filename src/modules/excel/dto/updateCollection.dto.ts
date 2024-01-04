import { IsNotEmpty, IsNumber, IsString, isString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class UpdateCollectionCostDto {
  @ApiProperty({
    description: `collection id`,
    example: 'dfasasd-sdasda-das-aaDSASd',
  })
  @IsNotEmpty()
  @IsString()
  readonly collectionId: string;

  @ApiProperty({
    description: `cost`,
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly cost: number;
}

export default UpdateCollectionCostDto;
