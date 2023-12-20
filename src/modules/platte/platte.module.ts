import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Platte } from './platte.entity';
import { PlatteService } from './platte.service';
import { PlatteController } from './platte.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Platte])],
  controllers: [PlatteController],
  providers: [PlatteService],
  exports: [PlatteService],
})
export class PlatteModule {}
