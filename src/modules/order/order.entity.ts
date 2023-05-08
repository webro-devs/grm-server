import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  isActive: string;

  @Column({ type: 'varchar' })
  seller: string;

  @Column({ type: 'varchar' })
  casher: string;

  @Column({ type: 'varchar' })
  product: string;

  @Column({ type: 'varchar' })
  date: string;

  @Column({ type: 'varchar' })
  kassa: string;

  @Column({ type: 'varchar' })
  price: string;
}
