import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Action } from './action.entity';
import { ActionRepository } from './action.repository';
import { ActionService } from './action.service';
import { ActionController } from './action.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Action])],
  controllers: [ActionController],
  providers: [ActionService, ActionRepository],
  exports: [ActionService, ActionRepository],
})
export class ActionModule {}
