import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../product/product.entity';
import { ColumnNumericTransformer } from '../../infra/helpers';
import { User } from '../user/user.entity';

@Entity('order_basket')
export class OrderBasket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('numeric', {
    precision: 20,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
    default: 0,
  })
  x: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: string;

  @Column('boolean', { default: false })
  isMetric: boolean;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  seller: User;

  @ManyToOne(() => Product, (prod) => prod.id)
  @JoinColumn()
  product: Product;
}