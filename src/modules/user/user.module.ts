import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FilialModule } from '../filial/filial.module';
import { PositionModule } from '../position/position.module';
import { ProductModule } from '../product/product.module';
import { ActionModule } from '../action/action.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    FilialModule,
    PositionModule,
    ProductModule,
    ActionModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
