import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Kassa } from './kassa.entity';
import { KassaRepository } from './kassa.repository';
import { KassaService } from './kassa.service';
import { KassaController } from './kassa.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Kassa])],
  controllers: [KassaController],
  providers: [KassaService, KassaRepository],
  exports: [KassaService, KassaRepository],
})
export class KassaModule {}
