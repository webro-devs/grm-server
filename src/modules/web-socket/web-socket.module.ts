import { Module } from '@nestjs/common';
import { GRMGateway } from './web-socket.gateway';
import { SocketController } from './web-socket.controller';
import { OrderModule } from '../order/order.module';
import { TransferModule } from '../transfer/transfer.module';
import { CashflowModule } from '../cashflow/cashflow.module';
import { ProductModule } from '../product/product.module';
import { KassaModule } from '../kassa/kassa.module';
@Module({
  imports: [
    OrderModule,
    TransferModule,
    CashflowModule,
    ProductModule,
    KassaModule,
  ],
  providers: [GRMGateway],
  controllers: [SocketController],
})
export class GrmSocketModule {}
