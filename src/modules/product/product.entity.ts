import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../order/order.entity';
import { Filial } from '../filial/filial.entity';
import { Partiya } from '../partiya/partiya.entity';
import { Model } from '../model/model.entity';
import { User } from '../user/user.entity';
import { ClientOrder } from '../client-order/client-order.entity';
import { ColumnNumericTransformer } from '../../infra/helpers';
import { Color } from '../color/color.entity';
import { Booking } from '../booking/booking.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  code: string;

  @Column()
  country: string;

  @Column()
  count: number;

  @Column({ nullable: true })
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
  secondPrice: number;

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

  @Column('int', { default: 0 })
  book_count: number;

  @Column()
  style: string;

  @Column({ nullable: true })
  slug: string;

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

  @OneToMany(() => Booking, (bk) => bk.product)
  bookings: Booking[];

  public setTotalSize() {
    this.totalSize = +this.x * +this.y * this.count;
  }

  public calculateProductPrice() {
    this.price = this.x * this.y * this.priceMeter;
  }

  public setSlug() {
    let slug = [];
    if (this.model.title) {
      slug.push(this.model?.title);
    }
    if (this.color?.title) {
      slug.push(this.color.title);
    }
    if (this.shape) {
      slug.push(this.shape);
    }
    if (this.model?.collection?.title) {
      slug.push(this.model.collection.title);
    }
    if (this.style) {
      slug.push(this.style);
    }
    if (this.size) {
      slug.push(this.size);
    }
    if (this.country) {
      slug.push(this.country);
    }
    if (this.code) {
      slug.push(this.code);
    }
    this.slug = slug.join(' ');
  }
}
