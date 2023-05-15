import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Action } from './action.entity';
import { ActionService } from './action.service';
import { ActionController } from './action.controller';
import { ProductModule } from '../product/product.module';
import { ActionRepository } from './action.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Action]), ProductModule],
  controllers: [ActionController],
  providers: [ActionService, ActionRepository],
  exports: [ActionService, ActionRepository],
})
export class ActionModule {}
