import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Excel } from './excel.entity';
import { ExcelService } from './excel.service';
import { ExcelController } from './excel.controller';
import { FileModule } from '../file/file.module';
import { PartiyaModule } from '../partiya/partiya.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Excel]),
    FileModule,
    forwardRef(() => PartiyaModule),
  ],
  controllers: [ExcelController],
  providers: [ExcelService],
  exports: [ExcelService],
})
export class ExcelModule {}
