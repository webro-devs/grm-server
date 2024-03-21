import { Module } from '@nestjs/common';

import { DataSenderService } from './data-sender.service';
import { DataSenderController } from './data-sender.controller';
import { ProductModule } from '../product/product.module';
import { FilialModule } from '../filial/filial.module';

@Module({
  imports: [ProductModule, FilialModule],
  providers: [DataSenderService],
  controllers: [DataSenderController],
  exports: [DataSenderService]
})
export class DataSenderModule {}
