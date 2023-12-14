import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { QrBase } from '../qr-base/qr-base.entity';

@Entity('shape')
export class Shape {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  title: string;

  @OneToMany(() => QrBase, (qrBase) => qrBase.shape)
  qrBase: QrBase[];
}
