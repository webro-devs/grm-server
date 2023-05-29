import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Order } from './order.entity';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ProductModule } from '../product/product.module';
import { KassaModule } from '../kassa/kassa.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), ProductModule, KassaModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
  exports: [OrderService, OrderRepository],
})
export class OrderModule {}
