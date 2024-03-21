import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@ValidatorConstraint({ name: 'timeFormat', async: false })
export class TimeFormatValidator implements ValidatorConstraintInterface {
  validate(time: string, args: ValidationArguments) {
    // Regular expression to match time format HH:MM
    const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Invalid time format. Time should be in HH:MM format (00:00 - 23:59)';
  }
}

class UpdateMagazinInfoDto {
  @ApiProperty({
    description: `terms`,
    example: 'something...',
  })
  @IsOptional()
  @IsString()
  readonly terms: string;

  @ApiProperty({
    description: `availability`,
    example: 'something...',
  })
  @IsOptional()
  @IsString()
  readonly availability: string;

  @ApiProperty({
    description: `start time`,
    example: '21:00',
  })
  @Validate(TimeFormatValidator)
  @IsOptional()
  @IsString()
  readonly start_time: string;

  @ApiProperty({
    description: `end time`,
    example: '22:00',
  })
  @Validate(TimeFormatValidator)
  @IsOptional()
  @IsString()
  readonly end_time: string;

  @ApiProperty({
    description: `count`,
    example: '1',
  })
  @IsOptional()
  @IsNumber()
  readonly count: number;

  @ApiProperty({
    description: `Allowed`,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  readonly allowed: boolean;
}

export default UpdateMagazinInfoDto;
