import { MiddlewareConsumer, Module, RequestMethod, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Order } from './order.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ProductModule } from '../product/product.module';
import { KassaModule } from '../kassa/kassa.module';
import { ActionModule } from '../action/action.module';
import { CashflowModule } from '../cashflow/cashflow.module';
import { GrmSocketModule } from '../web-socket/web-socket.module';
import { OrderQueryParserMiddleware } from 'src/infra/middleware';
import { FilialModule } from '../filial/filial.module';
import { OrderBasketModule } from '../order-basket/order-basket.module';
import { TransferModule } from '../transfer/transfer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    forwardRef(() => GrmSocketModule),
    ProductModule,
    KassaModule,
    ActionModule,
    CashflowModule,
    FilialModule,
    OrderBasketModule,
    TransferModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(OrderQueryParserMiddleware).forRoutes({ path: '/order', method: RequestMethod.GET });
  }
}
