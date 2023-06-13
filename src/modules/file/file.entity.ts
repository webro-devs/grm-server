import { Product } from '../product/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('file')
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column()
  model: string;

  @Column()
  color: string;

  @Column()
  shape: string;

  @Column()
  style: string;

  @OneToMany(() => Product, (product) => product.imgUrl)
  products: Product;
}
