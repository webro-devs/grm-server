import { Module } from '@nestjs/common';

import { DataSenderService } from './data-sender.service';
import { DataSenderController } from './data-sender.controller';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [ProductModule],
  providers: [DataSenderService],
  controllers: [DataSenderController],
})
export class DataSenderModule {}
