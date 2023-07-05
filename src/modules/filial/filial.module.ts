import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Filial } from './filial.entity';
import { FilialService } from './filial.service';
import { FilialController } from './filial.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Filial])],
  controllers: [FilialController],
  providers: [FilialService],
  exports: [FilialService],
})
export class FilialModule {}
