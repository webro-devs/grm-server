import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import configuration from '../config';
import { CollectionModule } from './modules/collection/collection.module';
import { FilialModule } from './modules/filial/filial.module';
import { KassaModule } from './modules/kassa/kassa.module';
import { PartiyaModule } from './modules/partiya/partiya.module';
import { PositionModule } from './modules/position/position.module';
import { ProductModule } from './modules/product/product.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrderModule } from './modules/order/order.module';
import { CashflowModule } from './modules/cashflow/cashflow.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { StyleModule } from './modules/style/style.module';
import { ShapeModule } from './modules/shape/shape.module';
import { FileModule } from './modules/file/file.module';
import { ModelModule } from './modules/model/model.module';
import { GrmSocketModule } from './modules/web-socket/web-socket.module';
import { TransferModule } from './modules/transfer/transfer.module';
import { ColorModule } from './modules/color/color.module';
import { ExcelModule } from './modules/excel/excel.module';
import { AccountingModule } from './modules/accounting/accounting.module';
import { ClientRequestModule } from './modules/client-request/client-request.module';

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
    AccountingModule,
    AuthModule,
    CashflowModule,
    ClientRequestModule,
    CollectionModule,
    ColorModule,
    ExcelModule,
    FileModule,
    FilialModule,
    GrmSocketModule,
    KassaModule,
    ModelModule,
    OrderModule,
    PartiyaModule,
    PositionModule,
    ProductModule,
    ShapeModule,
    StyleModule,
    TransferModule,
    UserModule,
  ],
})
export class AppModule {}
