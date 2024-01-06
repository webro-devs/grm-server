import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Collection } from '../collection/collection.entity';
import { Product } from '../product/product.entity';
import { QrBase } from '../qr-base/qr-base.entity';
import { ProductExcel } from '../excel/excel-product.entity';

@Entity('model')
export class Model {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  title: string;

  @ManyToOne(() => Collection, (collection) => collection.model)
  collection: Collection[];

  @OneToMany(() => Product, (product) => product.model)
  products: Product[];

  @OneToMany(() => QrBase, (qrBase) => qrBase.model)
  qrBase: QrBase[];

  @OneToMany(() => ProductExcel, (product) => product.model)
  productsExcel: ProductExcel[];
}
