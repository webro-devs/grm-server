import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { QrBase } from '../qr-base/qr-base.entity';
import { ProductExcel } from '../excel/excel-product.entity';

@Entity('style')
export class Style {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @OneToMany(() => QrBase, (qrBase) => qrBase.style)
  qrBase: QrBase[];

  @OneToMany(() => ProductExcel, (product) => product.style)
  productsExcel: ProductExcel[];
}
