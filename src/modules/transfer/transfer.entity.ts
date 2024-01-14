import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Filial } from '../filial/filial.entity';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';

@Entity('transfer')
export class Transfer {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('varchar', { default: 'Нет имя', nullable: true })
  title: string;

  @Column({ type: 'int' })
  count: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: string;

  @Column({ type: 'boolean', default: false })
  isChecked: boolean = false;

  @Column({ type: 'varchar', default: 'Processing' })
  progres: string;

  @ManyToOne(() => Filial, (filial) => filial)
  @JoinColumn()
  from: Filial;

  @ManyToOne(() => Filial, (filial) => filial)
  @JoinColumn()
  to: Filial;

  @ManyToOne(() => Product, (product) => product)
  @JoinColumn()
  product: Product;

  @ManyToOne(() => User, (user) => user.transfers)
  @JoinColumn()
  transferer: User;

  @ManyToOne(() => User, (user) => user.transferCashier)
  @JoinColumn()
  cashier: User;
}
