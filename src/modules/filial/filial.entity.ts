import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Kassa } from '../kassa/kassa.entity';
import { User } from '../user/user.entity';
import { Product } from '../product/product.entity';

@Entity('filial')
export class Filial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  address: string;

  @Column()
  startWorkTime: string;

  @Column()
  endWorkTime: string;

  @OneToMany(() => Kassa, (kassa) => kassa.filial)
  kassa: Kassa[];

  @OneToMany(() => User, (user) => user.filial)
  users: User[];

  @OneToMany(() => Product, (product) => product.filial)
  products: Product[];
}
