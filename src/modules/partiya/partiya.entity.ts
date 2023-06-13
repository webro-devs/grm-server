import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../product/product.entity';

@Entity('partiya')
export class Partiya {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  country: string;

  @Column({ type: 'decimal' })
  cost: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: string;

  @Column({ type: 'decimal' })
  expense: number;

  @Column({ type: 'decimal' })
  orderQuantity: number;

  @Column({ type: 'decimal' })
  price: number;

  @Column({ type: 'decimal' })
  sum: number;

  @OneToMany(() => Product, (product) => product.partiya)
  products: Product[];
}
