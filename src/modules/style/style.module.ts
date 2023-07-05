import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Style } from './style.entity';
import { StyleService } from './style.service';
import { StyleController } from './style.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Style])],
  controllers: [StyleController],
  providers: [StyleService],
  exports: [StyleService],
})
export class StyleModule {}
