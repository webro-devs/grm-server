import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRoleType } from '../../infra/shared/type';
import { Position } from '../position/position.entity';
import { Order } from '../order/order.entity';
import { Cashflow } from '../cashflow/cashflow.entity';
import { Filial } from '../filial/filial.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
  number: string;

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

  public async hashPassword(password: string): Promise<void> {
    this.password = await bcrypt.hash(password, 10);
  }

  public isPasswordValid(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
