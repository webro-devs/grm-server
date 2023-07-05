import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FilialModule } from '../filial/filial.module';
import { PositionModule } from '../position/position.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), FilialModule, PositionModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
