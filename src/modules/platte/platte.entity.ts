import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../product/product.entity';
import { QrBase } from '../qr-base/qr-base.entity';

@Entity('platte')
export class Platte {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  title: string;

  @Column({ type: 'varchar', nullable: true })
  code: string;

  @OneToMany(() => Product, (product) => product.platte)
  products: Product[];

  @OneToMany(() => QrBase, (qrBase) => qrBase.platte)
  qrBase: QrBase[];
}
