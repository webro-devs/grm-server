import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../product/product.entity';
import { QrBase } from '../qr-base/qr-base.entity';

@Entity('palette')
export class Palette {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  title: string;

  @OneToMany(() => Product, (product) => product.palette)
  products: Product[];

  @OneToMany(() => QrBase, (qrBase) => qrBase.palette)
  qrBase: QrBase[];
}
