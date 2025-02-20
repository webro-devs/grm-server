import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderBasket } from './order-basket.entity';
import { OrderBasketController } from './order-basket.controller';
import { OrderBasketService } from './order-basket.service';
import { BookingModule } from '../booking/booking.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderBasket]), BookingModule],
  controllers: [OrderBasketController],
  providers: [OrderBasketService],
  exports: [OrderBasketService],
})
export class OrderBasketModule {
}