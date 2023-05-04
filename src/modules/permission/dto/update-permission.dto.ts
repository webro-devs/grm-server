import { IsArray, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
class UpdatePermissionDto {
    @ApiProperty({
        description: `title`,
        example: 'Create',
    })
    @IsOptional()
    @IsString()
    readonly title: string;
}

export default UpdatePermissionDto;
