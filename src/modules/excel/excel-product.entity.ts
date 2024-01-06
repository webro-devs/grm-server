import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from '../order/order.entity';
import { Filial } from '../filial/filial.entity';
import { Partiya } from '../partiya/partiya.entity';
import { Model } from '../model/model.entity';
import { User } from '../user/user.entity';
import { ClientOrder } from '../client-order/client-order.entity';
import { ColumnNumericTransformer } from '../../infra/helpers';
import { Color } from '../color/color.entity';
import { Shape } from '../shape/shape.entity';
import { Size } from '../size/size.entity';
import { Style } from '../style/style.entity';
import { Collection } from '../collection/collection.entity';

@Entity('productexcel')
export class ProductExcel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true, default: 0 })
  count: number;

  @Column({ nullable: true, default: 0 })
  displayPrice: number;

  @Column({ nullable: true })
  imgUrl: string;

  @Column('jsonb', { nullable: true, default: [] })
  otherImgs: string[];

  @Column({ nullable: true, default: 0 })
  commingPrice: number;

  @Column({ nullable: true, default: 0 })
  collectionPrice: number;

  @Column({ nullable: true, default: 0 })
  priceMeter: number;

  @Column({ nullable: true, default: false })
  isMetric: boolean;

  @Column({ nullable: true, default: false })
  isEdited: boolean;

  @ManyToOne(() => Shape, (shape) => shape.productsExcel, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  shape: Shape;

  @ManyToOne(() => Size, (size) => size.productsExcel, { onDelete: 'SET NULL' })
  @JoinColumn()
  size: Size;

  @ManyToOne(() => Style, (style) => style.productsExcel, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  style: Style;

  @ManyToOne(() => Color, (color) => color.productsExcel, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  color: Color;

  @ManyToOne(() => Model, (model) => model.productsExcel, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  model: Model;

  @ManyToOne(() => Collection, (collection) => collection.productsExcel, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  collection: Collection;

  @ManyToOne(() => Partiya, (partiya) => partiya.productsExcel, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  partiya: Partiya;
}
