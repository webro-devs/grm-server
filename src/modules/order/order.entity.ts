import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Kassa } from '../kassa/kassa.entity';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';
import { Action } from '../action/action.entity';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'int' })
  count: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: string;

  @ManyToOne(() => User, (user) => user.sellerOrders)
  @JoinColumn()
  seller: User;

  @ManyToOne(() => User, (user) => user.casherOrders)
  @JoinColumn()
  casher: User;

  @ManyToOne(() => Kassa, (kassa) => kassa.orders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  kassa: Kassa;

  @ManyToOne(() => Product, (product) => product.orders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  product: Product;

  @OneToMany(() => Action, (action) => action.order)
  actions: Action[];
}
