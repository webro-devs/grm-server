import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import configuration from './config';
import { CollectionModule } from './modules/collection/collection.module';
import { FilialModule } from './modules/filial/filial.module';
import { KassaModule } from './modules/kassa/kassa.module';
import { PartiyaModule } from './modules/partiya/partiya.module';
import { PermissionModule } from './modules/permission/permission.module';
import { PositionModule } from './modules/position/position.module';
import { ProductModule } from './modules/product/product.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrderModule } from './modules/order/order.module';
import { CashflowModule } from './modules/cashflow/cashflow.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FileModule } from './modules/file/file.module';
import { ModelModule } from './modules/model/model.module';
import { GrmSocketModule } from './modules/web-socket/web-socket.module';
import { TransferModule } from './modules/transfer/transfer.module';
import { ActionModule } from './modules/action/action.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('database'),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    ActionModule,
    AuthModule,
    CashflowModule,
    CollectionModule,
    FileModule,
    FilialModule,
    GrmSocketModule,
    KassaModule,
    ModelModule,
    OrderModule,
    PartiyaModule,
    PermissionModule,
    PositionModule,
    ProductModule,
    TransferModule,
    UserModule,
  ],
})
export class AppModule {}
