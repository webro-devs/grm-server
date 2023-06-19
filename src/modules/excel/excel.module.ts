import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Excel } from './excel.entity';
import { ExcelRepository } from './excel.repository';
import { ExcelService } from './excel.service';
import { ExcelController } from './excel.controller';
import { FileModule } from '../file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([Excel]), FileModule],
  controllers: [ExcelController],
  providers: [ExcelService, ExcelRepository],
  exports: [ExcelService, ExcelRepository],
})
export class ExcelModule {}
