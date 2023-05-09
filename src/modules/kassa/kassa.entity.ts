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

@Entity('kassa')
export class Kassa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startDate: string;

  @Column({ type: 'timestamp' })
  endDate: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean = true;

  @ManyToOne(() => Filial, (filial) => filial.kassa)
  @JoinColumn()
  filial: Filial;

  @OneToMany(() => Order, (order) => order.kassa)
  orders: Order[];
}
