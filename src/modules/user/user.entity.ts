import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRoleType } from '../../infra/shared/type';
import { Position } from '../position/position.entity';
import { Order } from '../order/order.entity';
import { Cashflow } from '../cashflow/cashflow.entity';
import { Filial } from '../filial/filial.entity';
import { Action } from '../action/action.entity';
import { ClientOrder } from '../client-order/client-order.entity';
import { Product } from '../product/product.entity';
import { Transfer } from '../transfer/transfer.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: true })
  avatar: string;

  @Column({ type: 'varchar', nullable: true })
  firstName: string;

  @Column({ type: 'varchar', nullable: true })
  lastName: string;

  @Column({ type: 'varchar' })
  login: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'int' })
  role: UserRoleType;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  createdAt: string;

  @ManyToOne(() => Position, (position) => position.users)
  @JoinColumn()
  position: Position;

  @OneToMany(() => Order, (order) => order.seller)
  sellerOrders: Order[];

  @OneToMany(() => Order, (order) => order.casher)
  casherOrders: Order[];

  @OneToMany(() => Cashflow, (cashflow) => cashflow.casher, { nullable: true })
  cashflow: Cashflow[];

  @ManyToOne(() => Filial, (filial) => filial.users, { nullable: true })
  @JoinColumn()
  filial: Filial;

  @OneToMany(() => Action, (action) => action.user)
  actions: Action[];

  @OneToMany(() => ClientOrder, (clientOrder) => clientOrder.user)
  clientOrders: ClientOrder[];

  @ManyToMany(() => Product, (product) => product.favoriteUsers, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  favoriteProducts: Product[];

  @OneToMany(() => Transfer, (transfer) => transfer.transferer)
  transfers: Transfer[];

  @OneToMany(() => Transfer, (transfer) => transfer.cashier)
  transferCashier: Transfer[];

  public async hashPassword(password: string): Promise<void> {
    this.password = await bcrypt.hash(password, 10);
  }

  public isPasswordValid(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
