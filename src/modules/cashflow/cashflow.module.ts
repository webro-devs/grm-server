import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Cashflow } from './cashflow.entity';
import { CashflowService } from './cashflow.service';
import { CashflowController } from './cashflow.controller';
import { KassaModule } from '../kassa/kassa.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cashflow]), KassaModule],
  controllers: [CashflowController],
  providers: [CashflowService],
  exports: [CashflowService],
})
export class CashflowModule {}
