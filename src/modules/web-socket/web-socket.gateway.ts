import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OrderService } from '../order/order.service';
import { TransferService } from '../transfer/transfer.service';
import { CashflowService } from '../cashflow/cashflow.service';
import { ProductService } from '../product/product.service';
import { KassaService } from '../kassa/kassa.service';
import { ActionService } from '../action/action.service';
import { forwardRef, Inject } from '@nestjs/common';
import { Order } from '../order/order.entity';
import { Cashflow } from '../cashflow/cashflow.entity';

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
  async sendBossOrder(@MessageBody() order: Order) {
    this.server.emit('bossOrder', order);
  }

  @SubscribeMessage('cashflow')
  async Cashflow(@MessageBody() body: Cashflow) {
    this.server.emit('bossOrder', body);
  }

  @SubscribeMessage('action')
  async Action(id: string) {
    const action = await this.actionService.getOne(id);
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
    console.log('join room', room);
    client.join(room);
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(client: Socket, room: string) {
    console.log('leave room', room);
    client.leave(room);
  }

  @SubscribeMessage('test')
  test(client: Socket) {
    this.server.to(client.id).emit('best', 'Hello world, this is my word');
  }
}

// 10 11 12 14 16 18 19
