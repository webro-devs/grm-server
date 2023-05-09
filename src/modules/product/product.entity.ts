import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../order/order.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  color: string;

  @Column()
  count: number;

  @Column()
  imgUrl: string;

  @Column({ nullable: true })
  price: number;

  @Column()
  shape: string;

  @Column()
  size: string;

  @Column()
  style: string;

  @OneToMany(() => Order, (order) => order.product)
  orders: Order[];
}
