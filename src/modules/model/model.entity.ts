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

  @ManyToOne(() => Collection, (collection) => collection.model, { onDelete: 'SET NULL' })
  collection: Collection[];

  @OneToMany(() => Product, (product) => product.model, { onDelete: 'SET NULL' })
  products: Product[];

  @OneToMany(() => QrBase, (qrBase) => qrBase.model, { onDelete: 'SET NULL' })
  qrBase: QrBase[];

  @OneToMany(() => ProductExcel, (product) => product.model, { onDelete: 'SET NULL' })
  productsExcel: ProductExcel[];
}
