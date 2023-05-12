import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Kassa } from '../kassa/kassa.entity';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', default: false })
  isActive: boolean = false;

  @Column({ type: 'varchar' })
  price: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: string;

  @ManyToOne(() => User, (user) => user.sellerOrders)
  @JoinColumn()
  seller: User;

  @ManyToOne(() => User, (user) => user.casherOrders)
  @JoinColumn()
  casher: User;

  @ManyToOne(() => Kassa, (kassa) => kassa.orders)
  @JoinColumn()
  kassa: Kassa;

  @ManyToOne(() => Product, (product) => product.orders)
  @JoinColumn()
  product: Product;
}
