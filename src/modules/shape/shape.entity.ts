import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { QrBase } from '../qr-base/qr-base.entity';
import { ProductExcel } from '../excel/excel-product.entity';

@Entity('shape')
export class Shape {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  title: string;

  @Column({ default: false, nullable: true })
  meter: string;

  @OneToMany(() => QrBase, (qrBase) => qrBase.shape, { onDelete: 'SET NULL' })
  qrBase: QrBase[];

  @OneToMany(() => ProductExcel, (product) => product.shape, { onDelete: 'SET NULL' })
  productsExcel: ProductExcel[];
}
