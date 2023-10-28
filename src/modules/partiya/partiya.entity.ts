import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Excel } from '../excel/excel.entity';
import { Product } from '../product/product.entity';
import { ColumnNumericTransformer } from '../../infra/helpers';

@Entity('partiya')
export class Partiya {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  country: string;

  @Column('numeric', {
    precision: 20,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
    default: 0,
  })
  expense: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: string;

  @OneToMany(() => Product, (product) => product.partiya)
  products: Product[];

  @OneToOne(() => Excel, (excel) => excel.partiya, {
    onDelete: 'SET NULL',
  })
  excel: Excel;
}
