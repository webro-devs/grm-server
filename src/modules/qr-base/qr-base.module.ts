import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QrBase } from './qr-base.entity';
import { QrBaseService } from './qr-base.service';
import { QrBaseController } from './qr-base.controller';
import { ColorModule } from '../color/color.module';
import { StyleModule } from '../style/style.module';
import { SizeModule } from '../size/size.module';
import { CountryModule } from '../country/country.module';
import { ShapeModule } from '../shape/shape.module';
import { ModelModule } from '../model/model.module';
import { CollectionModule } from '../collection/collection.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([QrBase]),
    ColorModule,
    StyleModule,
    SizeModule,
    CountryModule,
    ShapeModule,
    ModelModule,
    CollectionModule,
  ],
  controllers: [QrBaseController],
  providers: [QrBaseService],
  exports: [QrBaseService],
})
export class QrBaseModule {}
