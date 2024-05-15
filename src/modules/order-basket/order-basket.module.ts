import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderBasket } from './order-basket.entity';
import { OrderBasketController } from './order-basket.controller';
import { OrderBasketService } from './order-basket.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderBasket])],
  controllers: [OrderBasketController],
  providers: [OrderBasketService],
  exports: [],
})
export class OrderBasketModule {
}