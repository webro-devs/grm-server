import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  size: string;

  @Column()
  count: number;

  @Column()
  shape: string;

  @Column()
  style: string;

  @Column()
  color: string;

  @Column()
  price: string;

  @Column()
  imgUrl: string;
}
