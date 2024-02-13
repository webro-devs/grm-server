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

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    ProductModule,
    KassaModule,
    ActionModule,
    CashflowModule,
    forwardRef(() => GrmSocketModule),
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
