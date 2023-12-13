import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Color } from '../color/color.entity';
import { Model } from '../model/model.entity';

@Entity('qrbase')
export class QrBase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  code: string;

  @Column()
  country: string;

  @Column()
  collection: string;

  @Column()
  size: string;

  @Column()
  shape: string;

  @Column()
  style: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: string;

  // relations ->
  // Model
  @ManyToOne(() => Model, (model) => model.qrBase)
  @JoinColumn()
  model: Model;

  // Color
  @ManyToOne(() => Color, (color) => color.qrBase, { onDelete: 'SET NULL' })
  @JoinColumn()
  color: Color;
}
