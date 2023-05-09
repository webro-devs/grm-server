import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Kassa } from '../kassa/kassa.entity';
import { User } from '../user/user.entity';

@Entity('cashflow')
export class Cashflow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  price: number;

  @Column('varchar')
  type: string;

  @Column('varchar')
  comment: string;

  @Column('varchar')
  date: string;

  @ManyToOne(() => Kassa, (kassa) => kassa.cashflow)
  @JoinColumn()
  kassa: Kassa;

  @ManyToOne(() => User, (user) => user.cashflow)
  @JoinColumn()
  casher: User;
}
