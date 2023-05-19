import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Kassa } from './kassa.entity';
import { KassaRepository } from './kassa.repository';
import { KassaService } from './kassa.service';
import { KassaController } from './kassa.controller';
import { KassaQueryParserMiddleware } from '../../infra/middleware';
import { FilialModule } from '../filial/filial.module';

@Module({
  imports: [TypeOrmModule.forFeature([Kassa]), FilialModule],
  controllers: [KassaController],
  providers: [KassaService, KassaRepository],
  exports: [KassaService, KassaRepository],
})
export class KassaModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(KassaQueryParserMiddleware)
      .forRoutes({
        path: '/kassa/calculate/by-range',
        method: RequestMethod.GET,
      }),
      { path: '/kassa/calculate/by-range', method: RequestMethod.GET };
  }
}
