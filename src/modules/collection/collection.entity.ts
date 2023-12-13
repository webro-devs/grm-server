import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../product/product.entity';
import { Model } from '../model/model.entity';

@Entity('collection')
export class Collection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {unique: true})
  title: string;

  @OneToMany(() => Model, (model) => model.collection)
  model: Model[];
}
