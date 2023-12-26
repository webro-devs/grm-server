import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Palette } from './platte.entity';
import { PlatteService } from './platte.service';
import { PlatteController } from './platte.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Palette])],
  controllers: [PlatteController],
  providers: [PlatteService],
  exports: [PlatteService],
})
export class PlatteModule {}
