import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FileEntity } from './file.entity';
import { FileRepository } from './file.repository';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { ExcelDataValidation } from 'src/infra/validators';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  controllers: [FileController],
  providers: [FileService, FileRepository, ExcelDataValidation],
  exports: [FileService, FileRepository],
})
export class FileModule {}
