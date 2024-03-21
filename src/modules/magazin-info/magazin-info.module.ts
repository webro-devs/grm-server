import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MagazinInfo } from './magazin-info.entity';
import { MagazinInfoService } from './magazin-info.service';
import { MagazinInfoController } from './magazin-info.controller';
import { DataSenderModule } from '../data-sender/data-sender.module';

@Module({
  imports: [TypeOrmModule.forFeature([MagazinInfo]), DataSenderModule],
  controllers: [MagazinInfoController],
  providers: [MagazinInfoService],
  exports: [MagazinInfoService],
})
export class MagazinInfoModule {}
