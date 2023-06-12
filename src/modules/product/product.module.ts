import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from './product.entity';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductQueryParserMiddleware } from '../../infra/middleware';
import { FilialModule } from '../filial/filial.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), FilialModule],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  exports: [ProductService, ProductRepository],
})
export class ProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ProductQueryParserMiddleware)
      .forRoutes(
        { path: 'product/remaining-products', method: RequestMethod.GET },
        { path: '/product', method: RequestMethod.GET },
      );
  }
}
