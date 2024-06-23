import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Kassa } from './kassa.entity';
import { KassaService } from './kassa.service';
import { KassaController } from './kassa.controller';
import { KassaQueryParserMiddleware } from '../../infra/middleware';
import { FilialModule } from '../filial/filial.module';
import { ActionModule } from '../action/action.module';

@Module({
  imports: [TypeOrmModule.forFeature([Kassa]), FilialModule, ActionModule],
  controllers: [KassaController],
  providers: [KassaService],
  exports: [KassaService],
})
export class KassaModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(KassaQueryParserMiddleware).forRoutes(
      {
        path: '/kassa/calculate/by-range',
        method: RequestMethod.GET,
      },
      {
        path: '/kassa',
        method: RequestMethod.GET,
      },
      {
        path: '/kassa/calculate/all-filial/by-range',
        method: RequestMethod.GET,
      },
    ),
      { path: '/kassa/calculate/by-range', method: RequestMethod.GET };
  }
}
