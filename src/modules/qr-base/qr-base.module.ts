import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QrBase } from './qr-base.entity';
import { QrBaseService } from './qr-base.service';
import { QrBaseController } from './qr-base.controller';

@Module({
  imports: [TypeOrmModule.forFeature([QrBase])],
  controllers: [QrBaseController],
  providers: [QrBaseService],
  exports: [QrBaseService],
})
export class QrBaseModule {}
