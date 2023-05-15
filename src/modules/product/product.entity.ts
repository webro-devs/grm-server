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
import { Partiya } from '../partiya/partiya.entity';
import { Model } from '../model/model.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

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

  @ManyToOne(() => Filial, (filial) => filial.products)
  @JoinColumn()
  filial: Filial;

  @ManyToOne(() => Model, (model) => model.products)
  @JoinColumn()
  model: Model;

  @ManyToOne(() => Partiya, (partiya) => partiya.products)
  @JoinColumn()
  partiya: Partiya;
}
