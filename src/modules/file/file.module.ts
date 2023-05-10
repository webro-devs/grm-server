import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FileEntity } from './file.entity';
import { FileRepository } from './file.repository';
import { FileService } from './file.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  providers: [FileService, FileRepository],
  exports: [FileService, FileRepository],
})
export class FileModule {}
