import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../product/product.entity';
import { QrBase } from '../qr-base/qr-base.entity';
import { ProductExcel } from '../excel/excel-product.entity';

@Entity('color')
export class Color {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  title: string;

  @Column({ type: 'varchar', nullable: true })
  code: string;

  @OneToMany(() => Product, (product) => product.color)
  products: Product[];

  @OneToMany(() => QrBase, (qrBase) => qrBase.color)
  qrBase: QrBase[];

  @OneToMany(() => ProductExcel, (product) => product.color)
  productsExcel: ProductExcel[];
}
