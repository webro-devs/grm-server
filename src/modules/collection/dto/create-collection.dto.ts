import { IsArray, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
class CreateCollectionDto {
    @ApiProperty({
        description: `title`,
        example: 'SAG Carpets',
    })
    @IsNotEmpty()
    @IsString()
    readonly title: string;
}

export default CreateCollectionDto;
