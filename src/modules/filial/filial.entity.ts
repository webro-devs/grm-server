import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Kassa } from '../kassa/kassa.entity';

@Entity('filial')
export class Filial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  address: string;

  @Column()
  startWorkTime: string;

  @Column()
  endWorkTime: string;

  @OneToMany(() => Kassa, (kassa) => kassa.filial)
  kassa: Kassa[];
}
