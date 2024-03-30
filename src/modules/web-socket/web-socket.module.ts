import { forwardRef, Module } from '@nestjs/common';
import { GRMGateway } from './web-socket.gateway';
import { SocketController } from './web-socket.controller';
import { OrderModule } from '../order/order.module';
import { TransferModule } from '../transfer/transfer.module';
import { CashflowModule } from '../cashflow/cashflow.module';
import { ProductModule } from '../product/product.module';
import { KassaModule } from '../kassa/kassa.module';
import { ActionModule } from '../action/action.module';

@Module({
  imports: [
    forwardRef(() => OrderModule),
    forwardRef(() => CashflowModule),
    TransferModule,
    ProductModule,
    KassaModule,
    ActionModule,
  ],
  providers: [GRMGateway],
  controllers: [SocketController],
  exports: [GRMGateway],
})
export class GrmSocketModule {}
