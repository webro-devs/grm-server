import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Color } from '../color/color.entity';
import { Model } from '../model/model.entity';
import { Style } from '../style/style.entity';
import { Shape } from '../shape/shape.entity';
import { Size } from '../size/size.entity';
import { Collection } from '../collection/collection.entity';
import { Country } from '../country/country.entity';

@Entity('qrbase')
export class QrBase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { unique: true })
  code: string;

  @ManyToOne(() => Country, (country) => country.qrBase)
  @JoinColumn()
  country: Country;

  @ManyToOne(() => Collection, (collection) => collection.qrBase)
  @JoinColumn()
  collection: Collection;

  @ManyToOne(() => Size, (size) => size.qrBase)
  @JoinColumn()
  size: Size;

  @ManyToOne(() => Shape, (shape) => shape.qrBase)
  @JoinColumn()
  shape: Shape;

  @ManyToOne(() => Style, (style) => style.qrBase)
  @JoinColumn()
  style: Style;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: string;

  @ManyToOne(() => Model, (model) => model.qrBase)
  @JoinColumn()
  model: Model;

  @ManyToOne(() => Color, (color) => color.qrBase, { onDelete: 'SET NULL' })
  @JoinColumn()
  color: Color;
}
