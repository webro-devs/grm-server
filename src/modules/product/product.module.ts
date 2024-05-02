import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from './product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductQueryParserMiddleware } from '../../infra/middleware';
import { FilialModule } from '../filial/filial.module';
import { ModelModule } from '../model/model.module';
import { FileModule } from '../file/file.module';
import { ColorModule } from '../color/color.module';
import { CollectionModule } from '../collection/collection.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), FilialModule, ModelModule, FileModule, ColorModule, CollectionModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ProductQueryParserMiddleware)
      .forRoutes(
        { path: 'product/remaining-products', method: RequestMethod.GET },
        { path: '/product', method: RequestMethod.GET },
        { path: '/product/internet-shop', method: RequestMethod.GET },
      );
  }
}
