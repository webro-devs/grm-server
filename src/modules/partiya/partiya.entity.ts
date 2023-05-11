import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../product/product.entity';

@Entity('partiya')
export class Partiya {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  country: string;

  @Column()
  cost: number;

  @Column()
  expense: number;

  @Column()
  orderQuantity: number;

  @Column()
  price: number;

  @Column()
  sum: number;

  @OneToMany(() => Product, (product) => product.partiya)
  products: Product[];
}
