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
  endDate: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'decimal', default: 0, nullable: true })
  totalSum: number;

  @Column({ type: 'decimal', default: 0, nullable: true })
  additionalProfitTotalSum: number;

  @Column({ type: 'decimal', default: 0, nullable: true })
  netProfitTotalSum: number;

  @Column({ type: 'decimal', default: 0, nullable: true })
  totalSize: number;

  @Column({ type: 'decimal', default: 0, nullable: true })
  plasticSum: number;

  @Column({ type: 'decimal', default: 0, nullable: true })
  cashFlowSum: number;

  @Column({ type: 'decimal', default: 0, nullable: true })
  expenditureBoss: number;

  @Column({ type: 'decimal', default: 0, nullable: true })
  expenditureShop: number;

  @ManyToOne(() => Filial, (filial) => filial.kassa)
  @JoinColumn()
  filial: Filial;

  @OneToMany(() => Order, (order) => order.kassa)
  orders: Order[];

  @OneToMany(() => Cashflow, (cashflow) => cashflow.kassa)
  cashflow: Cashflow[];
}
