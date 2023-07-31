import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientOrder } from './client-order.entity';
import { ClientOrderService } from './client-order.service';
import { ClientOrderController } from './client-order.controller';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { FilialModule } from '../filial/filial.module';
import { KassaModule } from '../kassa/kassa.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientOrder]),
    ProductModule,
    UserModule,
    FilialModule,
    KassaModule,
  ],
  controllers: [ClientOrderController],
  providers: [ClientOrderService],
  exports: [ClientOrderService],
})
export class ClientOrderModule {}
