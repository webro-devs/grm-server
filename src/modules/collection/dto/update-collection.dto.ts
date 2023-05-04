import { IsArray, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
class UpdateCollectionDto {
    @ApiProperty({
        description: `title`,
        example: 'SAG Carpets',
    })
    @IsOptional()
    @IsString()
    readonly title: string;
}

export default UpdateCollectionDto;
