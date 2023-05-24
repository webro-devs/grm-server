import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'ws';
import { OrderService } from '../order/order.service';
import { TransferService } from '../transfer/transfer.service';
import { CashflowService } from '../cashflow/cashflow.service';
import { ProductService } from '../product/product.service';
import { KassaService } from '../kassa/kassa.service';

@WebSocketGateway()
export class GRMGateway implements OnGatewayInit {
  constructor(
    private readonly productService: ProductService,
    private readonly cashflowService: CashflowService,
    private readonly transferService: TransferService,
    private readonly orderService: OrderService,
    private readonly kassaService: KassaService,
  ) {}
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    this.server = server;
    console.log('WebSocket server initialized!');
  }

  handleConnection(client: any) {
    console.log(client.id);
  }

  handleDisconnect(client: any) {
    console.log(client.id);
  }

  @SubscribeMessage('orderedProduct')
  async orderProduct(
    @MessageBody() body: { orderId: string; filialId: string },
  ) {
    const order = await this.orderService.getById(body.orderId);
    const kassa = await this.kassaService.GetOpenKassa(body.filialId);
    this.server.to().emit('messageReceived', order);
  }

  @SubscribeMessage('checkOrder')
  async sendKassaSum(@MessageBody() id: string) {
    const data = await this.kassaService.getKassaSum(id);
    this.server.to(id).emit('messageReceived', data);
  }

  @SubscribeMessage('createRoom')
  createRoom(@MessageBody() id: string) {
    this.server.join(id);
  }
}
