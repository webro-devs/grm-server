import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from '../order/order.entity';
import { Filial } from '../filial/filial.entity';
import { Partiya } from '../partiya/partiya.entity';
import { Model } from '../model/model.entity';
import { User } from '../user/user.entity';
import { ClientOrder } from '../client-order/client-order.entity';
import { ColumnNumericTransformer } from '../../infra/helpers';
import { Color } from '../color/color.entity';
import { Size } from '../size/size.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column()
  count: number;

  @Column()
  imgUrl: string;

  @Column('jsonb')
  otherImgs: string[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: string;

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
  price2: number;

  @Column('numeric', {
    precision: 20,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
    default: 0,
  })
  priceMeter: number;

  @Column('numeric', {
    precision: 20,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
    default: 0,
  })
  comingPrice: number;

  @Column()
  shape: string;

  @Column()
  size: string;

  @Column('numeric', {
    nullable: true,
    precision: 20,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  x: number;

  @Column('numeric', {
    nullable: true,
    precision: 20,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  y: number;

  @Column('numeric', {
    nullable: true,
    precision: 20,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  totalSize: number;

  @Column()
  style: string;

  @Column({ type: 'boolean', default: false })
  isInternetShop: boolean = false;

  @Column({ nullable: true, type: 'text' })
  internetInfo: string;

  @Column({ type: 'boolean', default: false })
  isMetric: boolean = false;

  @OneToMany(() => Order, (order) => order.product)
  orders: Order[];

  @ManyToOne(() => Filial, (filial) => filial.products)
  @JoinColumn()
  filial: Filial;

  @ManyToOne(() => Model, (model) => model.products)
  @JoinColumn()
  model: Model;

  @ManyToOne(() => Partiya, (partiya) => partiya.products, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  partiya: Partiya;

  @ManyToMany(() => User, (user) => user.favoriteProducts, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  favoriteUsers: User[];

  @ManyToOne(() => Color, (color) => color.products, { onDelete: 'SET NULL' })
  @JoinColumn()
  color: Color;

  @OneToMany(() => ClientOrder, (clientOrder) => clientOrder.product)
  clientOrders: ClientOrder[];

  public setTotalSize() {
    this.totalSize = +this.x * +this.y * this.count;
  }

  public calculateProductPrice() {
    this.price = this.x * this.y * this.priceMeter;
  }
}
