import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from '../order/order.entity';
import { Cashflow } from '../cashflow/cashflow.entity';

@Entity('action')
export class Action {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: string;

  @Column()
  type: string;

  @Column()
  comment: string;

  @ManyToOne(() => Order, (order) => order.actions)
  @JoinColumn()
  order: Order;

  @ManyToOne(() => Cashflow, (cashflow) => cashflow.actions)
  @JoinColumn()
  cashFlow: Cashflow;
}
