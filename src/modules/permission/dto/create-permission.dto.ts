import { IsArray, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
class CreatePermissionDto {
    @ApiProperty({
        description: `title`,
        example: 'delede',
    })
    @IsNotEmpty()
    @IsString()
    readonly title: string;
}

export default CreatePermissionDto;
