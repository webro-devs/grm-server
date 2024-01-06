import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../product/product.entity';
import { QrBase } from '../qr-base/qr-base.entity';
import { ProductExcel } from '../excel/excel-product.entity';

@Entity('size')
export class Size {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  title: string;

  @OneToMany(() => QrBase, (qrBase) => qrBase.size)
  qrBase: QrBase[];

  @OneToMany(() => ProductExcel, (product) => product.size)
  productsExcel: ProductExcel[];
}
