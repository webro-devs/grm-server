import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Color } from './color.entity';
import { ColorRepository } from './color.repository';
import { ColorService } from './color.service';
import { ColorController } from './color.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Color])],
  controllers: [ColorController],
  providers: [ColorService, ColorRepository],
  exports: [ColorService, ColorRepository],
})
export class ColorModule {}
