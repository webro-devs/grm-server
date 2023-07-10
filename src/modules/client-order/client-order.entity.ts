import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Filial } from '../filial/filial.entity';
import { User } from '../user/user.entity';

@Entity('client_order')
export class ClientOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  firstName: string;

  @Column('varchar')
  lastName: string;

  @Column('varchar')
  phone: string;

  @Column({ type: 'boolean' })
  delivery: boolean;

  @Column({ type: 'varchar', nullable: true })
  city: string;

  @Column({ type: 'varchar', nullable: true })
  region: string;

  @Column({ type: 'varchar', nullable: true })
  street: string;

  @Column({ type: 'varchar', nullable: true })
  house: string;

  @Column({ type: 'varchar', nullable: true })
  comment: string;

  @Column({ type: 'varchar', nullable: true })
  date: string;

  @ManyToOne(() => Filial, (filial) => filial.clientOrders, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  filial: Filial;

  @ManyToOne(() => User, (user) => user.clientOrders, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  user: User;
}
