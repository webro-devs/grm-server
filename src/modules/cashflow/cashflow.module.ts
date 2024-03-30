import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Cashflow } from './cashflow.entity';
import { CashflowService } from './cashflow.service';
import { CashflowController } from './cashflow.controller';
import { KassaModule } from '../kassa/kassa.module';
import { ActionModule } from '../action/action.module';
import { GrmSocketModule } from '../web-socket/web-socket.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cashflow]), KassaModule, ActionModule, forwardRef(() => GrmSocketModule)],
  controllers: [CashflowController],
  providers: [CashflowService],
  exports: [CashflowService],
})
export class CashflowModule {}
