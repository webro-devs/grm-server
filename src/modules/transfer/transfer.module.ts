import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Transfer } from './transfer.entity';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';
import { ProductModule } from '../product/product.module';
import { TransferRepository } from './transfer.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Transfer]), ProductModule],
  controllers: [TransferController],
  providers: [TransferService, TransferRepository],
  exports: [TransferService, TransferRepository],
})
export class TransferModule {}
