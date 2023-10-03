import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Country } from './country.entity';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { StyleModule } from '../style/style.module';
import { ShapeModule } from '../shape/shape.module';
import { ColorModule } from '../color/color.module';
import { ModelModule } from '../model/model.module';
import { CollectionModule } from '../collection/collection.module';
import { SizeModule } from '../size/size.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Country]),
    StyleModule,
    ShapeModule,
    ColorModule,
    ModelModule,
    CollectionModule,
    SizeModule,
  ],
  controllers: [CountryController],
  providers: [CountryService],
  exports: [CountryService],
})
export class CountryModule {}
