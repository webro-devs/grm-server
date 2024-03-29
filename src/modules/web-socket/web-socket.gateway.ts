import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OrderService } from '../order/order.service';
import { TransferService } from '../transfer/transfer.service';
import { CashflowService } from '../cashflow/cashflow.service';
import { ProductService } from '../product/product.service';
import { KassaService } from '../kassa/kassa.service';
import { ActionService } from '../action/action.service';
import { Inject, forwardRef } from '@nestjs/common';

@WebSocketGateway()
export class GRMGateway implements OnGatewayInit {
  constructor(
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
    private readonly cashflowService: CashflowService,
    private readonly transferService: TransferService,
    private readonly kassaService: KassaService,
    private readonly actionService: ActionService,
  ) {}
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('WebSocket server initialized!');
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log(client.id);
    this.server.to(client.id).emit('message', 'you connected successfully');
  }

  handleDisconnect(client: any) {
    console.log(client.id);
    this.server.to(client.id).emit('message', 'you disconnected successfully');
  }

  @SubscribeMessage('ordered-product')
  async orderProduct(@MessageBody() body: { orderId: string; filialId: string }) {
    const order = await this.orderService.getById(body.orderId);
    const kassa = await this.kassaService.GetOpenKassa(body.filialId);

    kassa?.['id'] ? this.server.to(kassa['id']).emit('get-order', order) : null;
  }

  @SubscribeMessage('check-order')
  async sendKassaSum(@MessageBody() body: { kassaId: string; orderId: string }) {
    const kassaSum = await this.kassaService.getKassaSum(body.kassaId);
    const order = await this.orderService.getById(body.orderId);
    this.server.to(body.kassaId).emit('kassaSum', kassaSum);
    this.server.emit('bossOrder', order);
  }

  @SubscribeMessage('cashflow')
  async Cashflow(@MessageBody() id: string) {
    const cashflow = await this.cashflowService.getOne(id);
    this.server.emit('bossCashFlow', cashflow);
  }

  @SubscribeMessage('action')
  async Action() {
    const action = await this.actionService.getAll({ limit: 20, page: 1 });
    this.server.emit('userActions', action);
  }

  @SubscribeMessage('transfer')
  async transfer(@MessageBody() id: string) {
    console.log(id);

    const transfer = await this.transferService.getById(id);
    this.server.emit('transfer', transfer);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(client: Socket, room: string) {
    client.leave(room);
  }

  @SubscribeMessage('test')
  test(client: Socket) {
    this.server.to(client.id).emit('best', 'Hello world, this is my word');
  }
}

// 10 11 12 14 16 18 19
