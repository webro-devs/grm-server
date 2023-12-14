import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';

import { Collection } from './collection.entity';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Collection])],
  controllers: [CollectionController],
  providers: [CollectionService],
  exports: [CollectionService],
})
export class CollectionModule {}
