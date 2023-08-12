import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Transfer } from './transfer.entity';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { ActionModule } from '../action/action.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transfer]), ProductModule, UserModule, ActionModule],
  controllers: [TransferController],
  providers: [TransferService],
  exports: [TransferService],
})
export class TransferModule {}
