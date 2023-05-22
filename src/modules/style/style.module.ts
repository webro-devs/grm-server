import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Style } from './position.entity';
import { StyleRepository } from './style.repository';
import { StyleService } from './style.service';
import { StyleController } from './style.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Style])],
  controllers: [StyleController],
  providers: [StyleService, StyleRepository],
  exports: [StyleService, StyleRepository],
})
export class StyleModule {}
