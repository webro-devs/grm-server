import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { BookingQueryParserMiddleware } from '../../infra/middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), ProductModule],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(BookingQueryParserMiddleware)
      .forRoutes(
        { path: '/booking', method: RequestMethod.GET },
        { path: '/booking/by-user', method: RequestMethod.GET },
      );
  }
}
