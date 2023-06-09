import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Excel } from './excel.entity';
import { ExcelService } from './excel.service';
import { ExcelController } from './excel.controller';
import { FileModule } from '../file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([Excel]), FileModule],
  controllers: [ExcelController],
  providers: [ExcelService],
  exports: [ExcelService],
})
export class ExcelModule {}
