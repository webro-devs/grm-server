import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Kassa } from '../kassa/kassa.entity';
import { User } from '../user/user.entity';

@Entity('cashflow')
export class Cashflow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal')
  price: number;

  @Column('varchar')
  type: string;

  @Column('varchar')
  comment: string;

  @Column('varchar')
  title: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: string;

  @ManyToOne(() => Kassa, (kassa) => kassa.cashflow)
  @JoinColumn()
  kassa: Kassa;

  @ManyToOne(() => User, (user) => user.cashflow)
  @JoinColumn()
  casher: User;
}
