import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../product/product.entity';
import { QrBase } from '../qr-base/qr-base.entity';

@Entity('color')
export class Color {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {unique: true})
  title: string;

  @Column({ type: 'varchar', nullable: true })
  code: string;

  @OneToMany(() => Product, (product) => product.color)
  products: Product[];

  @OneToMany(() => QrBase, (qrBase) => qrBase.color)
  qrBase: QrBase[];
}
