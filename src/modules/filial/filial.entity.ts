import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Kassa } from '../kassa/kassa.entity';
import { User } from '../user/user.entity';
import { Product } from '../product/product.entity';
import { Action } from '../action/action.entity';
import { ClientOrder } from '../client-order/client-order.entity';

@Entity('filial')
export class Filial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  name: string;

  @Column()
  address: string;

  @Column()
  startWorkTime: string;

  @Column()
  endWorkTime: string;

  @Column()
  addressLink: string;

  @Column()
  landmark: string;

  @Column()
  phone1: string;

  @Column()
  phone2: string;

  @OneToMany(() => Kassa, (kassa) => kassa.filial, { cascade: true })
  kassa: Kassa[];

  @OneToMany(() => User, (user) => user.filial)
  users: User[];

  @OneToMany(() => Product, (product) => product.filial, { cascade: true })
  products: Product[];

  @OneToMany(() => Action, (action) => action.filial, { cascade: true })
  actions: Action[];

  @OneToMany(() => ClientOrder, (clientOrder) => clientOrder.filial, { cascade: true })
  clientOrders: ClientOrder[];
}
