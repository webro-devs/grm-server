import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientRequest } from './client-request.entity';
import { ClientRequestService } from './client-request.service';
import { ClientRequestController } from './client-request.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ClientRequest])],
  controllers: [ClientRequestController],
  providers: [ClientRequestService],
  exports: [ClientRequestService],
})
export class ClientRequestModule {}
