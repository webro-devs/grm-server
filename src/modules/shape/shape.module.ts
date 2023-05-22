import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Shape } from './shape.entity';
import { ShapeRepository } from './shape.repository';
import { ShapeService } from './shape.service';
import { ShapeController } from './shape.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Shape])],
  controllers: [ShapeController],
  providers: [ShapeService, ShapeRepository],
  exports: [ShapeService, ShapeRepository],
})
export class ShapeModule {}
