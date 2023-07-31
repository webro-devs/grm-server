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
import { ColumnNumericTransformer } from '../../infra/helpers';

@Entity('cashflow')
export class Cashflow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('numeric', {
    precision: 20,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
    default: 0,
  })
  price: number;

  @Column('varchar')
  type: string;

  @Column('varchar')
  comment: string;

  @Column('varchar', { nullable: true })
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
