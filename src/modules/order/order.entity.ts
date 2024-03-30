import { OrderEnum } from 'src/infra/shared/enum';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Kassa } from '../kassa/kassa.entity';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';
import { ColumnNumericTransformer } from '../../infra/helpers';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', default: OrderEnum.Progress })
  isActive: string;

  @Column('numeric', {
    precision: 20,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
    default: 0,
  })
  price: number;

  @Column('numeric', {
    precision: 20,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
    default: 0,
  })
  x: number;

  @Column('numeric', {
    precision: 20,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
    default: 0,
  })
  kv: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: string;

  @Column('numeric', {
    precision: 20,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
    default: 0,
  })
  additionalProfitSum: number;

  @Column('numeric', {
    precision: 20,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
    default: 0,
  })
  netProfitSum: number;

  @Column({ type: 'decimal', nullable: true })
  discountPercentage: number;

  @Column({ default: 'order' })
  tip: string;

  @Column('numeric', {
    precision: 20,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
    default: 0,
  })
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
