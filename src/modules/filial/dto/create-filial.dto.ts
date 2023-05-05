import { IsArray, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
class CreateFilialDto {
    @ApiProperty({
        description: `title`,
        example: 'Carpet center',
    })
    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @ApiProperty({
        description: `address`,
        example: 'Tashkent',
    })
    @IsNotEmpty()
    @IsString()
    readonly address: string;
}

export default CreateFilialDto;
