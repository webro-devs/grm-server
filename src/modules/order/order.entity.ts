import { OrderEnum } from 'src/infra/shared/enum';
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

  @Column({ type: 'varchar', default: OrderEnum.Progress })
  isActive: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column({ type: 'int' })
  count: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: string;

  @Column({ type: 'decimal', nullable: true })
  additionalProfitSum: number;

  @Column({ type: 'decimal', nullable: true })
  netProfitSum: number;

  @Column({ type: 'decimal', nullable: true })
  discountPercentage: number;

  @Column({ type: 'decimal', default: 0 })
  plasticSum: number;

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
}
