import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Partiya } from './partiya.entity';
import { PartiyaService } from './partiya.service';
import { PartiyaController } from './partiya.controller';
import { ExcelModule } from '../excel/excel.module';
import { ActionModule } from '../action/action.module';

@Module({
  imports: [TypeOrmModule.forFeature([Partiya]), ActionModule, forwardRef(() => ExcelModule)],
  controllers: [PartiyaController],
  providers: [PartiyaService],
  exports: [PartiyaService],
})
export class PartiyaModule {}
