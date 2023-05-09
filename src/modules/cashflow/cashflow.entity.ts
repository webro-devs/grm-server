import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Kassa } from '../kassa/kassa.entity';
import { User } from '../user/user.entity';

@Entity('cashflow')
export class Cashflow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  price: string;

  @Column('varchar')
  type: string;

  @Column('varchar')
  comment: string;

  @Column('varchar')
  date: string;

  @ManyToOne(() => Kassa, (kassa) => kassa.cashflow)
  kassa: Kassa;

  @ManyToOne(() => User, (user) => user.cashflow)
  user: User;
}
