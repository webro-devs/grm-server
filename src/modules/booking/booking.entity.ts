import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';

@Entity('booking')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  count: number;

  @ManyToOne(() => Product, (pr) => pr.bookings)
  @JoinColumn()
  product: Product;

  @ManyToOne(() => User, (ur) => ur.bookings)
  @JoinColumn()
  user: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: string;
}
