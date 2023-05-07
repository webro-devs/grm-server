import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
