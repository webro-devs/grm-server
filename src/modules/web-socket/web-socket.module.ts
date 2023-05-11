import { Module } from '@nestjs/common';
import { GRMGateway } from './web-socket.gateway';
import { SocketController } from './web-socket.controller';
@Module({
  providers: [GRMGateway],
  controllers: [SocketController],
})
export class GrmSocketModule {}
