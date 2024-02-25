import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Excel } from './excel.entity';
import { ProductExcel } from './excel-product.entity';
import { ExcelService } from './excel.service';
import { ExcelController } from './excel.controller';
import { FileModule } from '../file/file.module';
import { PartiyaModule } from '../partiya/partiya.module';
import { ProductModule } from '../product/product.module';
import { ModelModule } from '../model/model.module';
import { CollectionModule } from '../collection/collection.module';
import { ColorModule } from '../color/color.module';
import { ShapeModule } from '../shape/shape.module';
import { SizeModule } from '../size/size.module';
import { StyleModule } from '../style/style.module';
import { FilialModule } from '../filial/filial.module';
import { QrBaseModule } from '../qr-base/qr-base.module';
import { ActionModule } from '../action/action.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Excel, ProductExcel]),
    ActionModule,
    FileModule,
    forwardRef(() => PartiyaModule),
    ProductModule,
    ModelModule,
    CollectionModule,
    ColorModule,
    ShapeModule,
    SizeModule,
    StyleModule,
    FilialModule,
    QrBaseModule,
  ],
  controllers: [ExcelController],
  providers: [ExcelService],
  exports: [ExcelService],
})
export class ExcelModule {}
