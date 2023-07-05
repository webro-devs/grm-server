import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Shape } from './shape.entity';
import { ShapeService } from './shape.service';
import { ShapeController } from './shape.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Shape])],
  controllers: [ShapeController],
  providers: [ShapeService],
  exports: [ShapeService],
})
export class ShapeModule {}
