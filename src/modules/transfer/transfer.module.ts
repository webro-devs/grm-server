import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Transfer } from './transfer.entity';
import { TransferRepository } from './transfer.repository';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Transfer])],
  controllers: [TransferController],
  providers: [TransferService, TransferRepository],
  exports: [TransferService, TransferRepository],
})
export class TransferModule {}
