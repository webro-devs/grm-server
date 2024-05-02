import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Filial } from '../filial/filial.entity';
import { User } from '../user/user.entity';
import { Product } from '../product/product.entity';
import { ColumnNumericTransformer } from '../../infra/helpers';

@Entity('client_order')
export class ClientOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  firstName: string;

  @Column('varchar')
  lastName: string;

  @Column('varchar')
  phone: string;

  @Column({ type: 'boolean' })
  delivery: boolean;

  @Column('numeric', {
    precision: 7,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
    default: 0,
  })
  deliverySum: number;

  @Column('numeric', {
    precision: 20,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
    default: 0,
  })
  totalPrice: number;

  @Column({ type: 'varchar', nullable: true })
  location: string;

  @Column({ type: 'varchar', nullable: true })
  location_link: string;

  @Column({ type: 'varchar', nullable: true })
  comment: string;

  @Column({ type: 'varchar', nullable: true })
  date: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startDate: string;

  @Column({ type: 'int' })
  count: number;

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

  @Column({ type: 'boolean', default: false })
  isActive: boolean = false;

  @Column({ type: 'boolean', default: null, nullable: true })
  isChecked: boolean;

  @ManyToOne(() => Filial, (filial) => filial.clientOrders, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  filial: Filial;

  @ManyToOne(() => User, (user) => user.clientOrders, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Product, (product) => product, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  product: Product;
}
