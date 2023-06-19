import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Partiya } from './partiya.entity';
import { PartiyaRepository } from './partiya.repository';
import { PartiyaService } from './partiya.service';
import { PartiyaController } from './partiya.controller';
import { ExcelModule } from '../excel/excel.module';

@Module({
  imports: [TypeOrmModule.forFeature([Partiya]), ExcelModule],
  controllers: [PartiyaController],
  providers: [PartiyaService, PartiyaRepository],
  exports: [PartiyaService, PartiyaRepository],
})
export class PartiyaModule {}
