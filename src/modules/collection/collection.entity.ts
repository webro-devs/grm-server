import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../product/product.entity';
import { Model } from '../model/model.entity';
import { QrBase } from '../qr-base/qr-base.entity';
import { ProductExcel } from '../excel/excel-product.entity';
@Entity('collection')
export class Collection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @OneToMany(() => Model, (model) => model.collection)
  model: Model[];

  @OneToMany(() => QrBase, (qrBase) => qrBase.collection)
  qrBase: QrBase[];

  @OneToMany(() => ProductExcel, (product) => product.collection)
  productsExcel: ProductExcel[];
}
