import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Collection } from '../collection/collection.entity';
import { Product } from '../product/product.entity';

@Entity('model')
export class Model {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  title: string;

  @ManyToOne(() => Collection, (collection) => collection.model)
  collection: Collection[];

  @OneToMany(() => Product, (product) => product.model)
  products: Product[];
}
