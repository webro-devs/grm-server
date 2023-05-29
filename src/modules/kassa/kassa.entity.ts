import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from '../order/order.entity';
import { Filial } from '../filial/filial.entity';
import { Cashflow } from '../cashflow/cashflow.entity';

@Entity('kassa')
export class Kassa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startDate: string;

  @Column({ type: 'timestamp', nullable: true })
  endDate: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0, nullable: true })
  totalSum: number;

  @Column({ type: 'int', default: 0, nullable: true })
  expenditure: number;

  @ManyToOne(() => Filial, (filial) => filial.kassa)
  @JoinColumn()
  filial: Filial;

  @OneToMany(() => Order, (order) => order.kassa)
  orders: Order[];

  @OneToMany(() => Cashflow, (cashflow) => cashflow.kassa)
  cashflow: Cashflow[];
}
