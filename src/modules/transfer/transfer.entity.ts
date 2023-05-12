import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Filial } from '../filial/filial.entity';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';

@Entity('transfer')
export class Transfer {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('varchar')
  title: string;

  @Column({ type: 'int' })
  count: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: string;

  @ManyToOne(() => Filial, (filial) => filial)
  @JoinColumn()
  from: Filial;

  @ManyToOne(() => Filial, (filial) => filial)
  @JoinColumn()
  to: Filial;

  @ManyToOne(() => Product, (product) => product)
  @JoinColumn()
  product: Product;

  @ManyToOne(() => User, (user) => user)
  @JoinColumn()
  transferer: User;
}
