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
import { File } from '../file/file.entity';

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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: string;

  @Column({ nullable: true, type: 'decimal' })
  price: number;

  @Column()
  shape: string;

  @Column()
  size: string;

  @Column({ nullable: true, type: 'decimal' })
  x: number;

  @Column({ nullable: true, type: 'decimal' })
  y: number;

  @Column({ nullable: true, type: 'decimal' })
  totalSize: number;

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

  public setTotalSize() {
    this.totalSize = +this.x * +this.y * this.count;
  }
}
