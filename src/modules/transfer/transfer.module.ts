import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Transfer } from './transfer.entity';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import TransferQueryParserMiddleware from 'src/infra/middleware/transfer-query-parser';
import { ActionModule } from '../action/action.module';
import { FilialModule } from '../filial/filial.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transfer]), ProductModule, UserModule, ActionModule, FilialModule],
  controllers: [TransferController],
  providers: [TransferService],
  exports: [TransferService],
})
export class TransferModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TransferQueryParserMiddleware).forRoutes({ path: '/transfer', method: RequestMethod.GET });
  }
}
