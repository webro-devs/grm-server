import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Filial } from './filial.entity';
import { FilialRepository } from './filial.repository';
import { FilialService } from './filial.service';
import { FilialController } from './filial.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Filial])],
  controllers: [FilialController],
  providers: [FilialService, FilialRepository],
  exports: [FilialService, FilialRepository],
})
export class ProductModule {}
