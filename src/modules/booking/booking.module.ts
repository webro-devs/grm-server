import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { BookingQueryParserMiddleware } from '../../infra/middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';

@Module({
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
  imports: [TypeOrmModule.forFeature([Booking])],
})
export class BookingModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(BookingQueryParserMiddleware)
      .forRoutes(
        { path: '/booking', method: RequestMethod.GET },
        { path: '/booking/by-user', method: RequestMethod.GET },
      );
  }
}
