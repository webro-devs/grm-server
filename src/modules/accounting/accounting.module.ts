import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';

import { AccountingService } from './accounting.service';
import { AccountingController } from './accounting.controller';
import { KassaModule } from '../kassa/kassa.module';
import { ProductModule } from '../product/product.module';
import { FilialModule } from '../filial/filial.module';
import { CollectionModule } from '../collection/collection.module';
import { KassaQueryParserMiddleware } from '../../infra/middleware';

@Module({
  imports: [KassaModule, ProductModule, FilialModule, CollectionModule],
  controllers: [AccountingController],
  providers: [AccountingService],
  exports: [AccountingService],
})
export class AccountingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(KassaQueryParserMiddleware).forRoutes(
      {
        path: '/accounting/full',
        method: RequestMethod.GET,
      },
      {
        path: '/accounting/filial/by-range',
        method: RequestMethod.GET,
      },
    );
  }
}
