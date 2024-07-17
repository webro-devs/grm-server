import { Module } from '@nestjs/common';

import { DataSenderService } from './data-sender.service';
import { DataSenderController } from './data-sender.controller';
import { ProductModule } from '../product/product.module';
import { FilialModule } from '../filial/filial.module';
import { MagazinInfoModule } from '../magazin-info/magazin-info.module';
import { IncrementModule } from '../increment/increment.module';

@Module({
  imports: [ProductModule, FilialModule, MagazinInfoModule, IncrementModule],
  providers: [DataSenderService],
  controllers: [DataSenderController],
  exports: [DataSenderService]
})
export class DataSenderModule {}
