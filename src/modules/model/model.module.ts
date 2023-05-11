import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Model } from './model.entity';
import { ModelRepository } from './model.repository';
import { ModelService } from './model.service';
import { ModelController } from './model.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Model])],
  controllers: [ModelController],
  providers: [ModelService, ModelRepository],
  exports: [ModelService, ModelRepository],
})
export class ModelModule {}
