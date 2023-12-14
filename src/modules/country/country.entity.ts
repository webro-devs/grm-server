import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { QrBase } from '../qr-base/qr-base.entity';

@Entity('country')
export class Country {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  title: string;

  @OneToMany(() => QrBase, (qrBase) => qrBase.country)
  qrBase: QrBase[];
}
