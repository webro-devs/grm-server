import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreateSenderDataDto {
  @ApiProperty({
    description: `Start time for sending`,
    example: '09:00',
  })
  @IsNotEmpty()
  @IsString()
  readonly startTime: string;

  @ApiProperty({
    description: `End time for sending`,
    example: '21:00',
  })
  @IsNotEmpty()
  @IsString()
  readonly endTime: string;

  @ApiProperty({
    description: `Count data`,
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly count: number;
}

export default CreateSenderDataDto;
