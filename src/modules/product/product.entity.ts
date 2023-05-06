import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  color: string;

  @Column()
  count: number;

  @Column()
  imgUrl: string;

  @Column({ nullable: true })
  price: number;

  @Column()
  shape: string;

  @Column()
  size: string;

  @Column()
  style: string;
}
