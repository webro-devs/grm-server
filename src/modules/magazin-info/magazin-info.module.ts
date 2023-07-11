import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MagazinInfo } from './magazin-info.entity';
import { MagazinInfoService } from './magazin-info.service';
import { MagazinInfoController } from './magazin.info.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MagazinInfo])],
  controllers: [MagazinInfoController],
  providers: [MagazinInfoService],
  exports: [MagazinInfoService],
})
export class MagazinInfoModule {}
