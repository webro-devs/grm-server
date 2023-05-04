import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
