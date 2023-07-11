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

  @Column({ type: 'decimal', default: 0 })
  deliverySum: number;

  @Column({ type: 'decimal', default: 0 })
  totalPrice: number;

  @Column({ type: 'varchar', nullable: true })
  city: string;

  @Column({ type: 'varchar', nullable: true })
  region: string;

  @Column({ type: 'varchar', nullable: true })
  street: string;

  @Column({ type: 'varchar', nullable: true })
  house: string;

  @Column({ type: 'varchar', nullable: true })
  comment: string;

  @Column({ type: 'varchar', nullable: true })
  date: string;

  @Column('simple-json')
  count

  @Column({type:"boolean",default:false})
  isActive:boolean = false

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

  @ManyToMany(() => Product, (product) => product, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  products: Product[];
}
