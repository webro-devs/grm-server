import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Partiya } from '../partiya/partiya.entity';
import { Model } from '../model/model.entity';
import { Color } from '../color/color.entity';
import { Shape } from '../shape/shape.entity';
import { Size } from '../size/size.entity';
import { Style } from '../style/style.entity';
import { Collection } from '../collection/collection.entity';
import { ColumnNumericTransformer } from 'src/infra/helpers';

@Entity('productexcel')
export class ProductExcel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true, default: 0 })
  count: number;

  @Column({ precision: 20, scale: 2, transformer: new ColumnNumericTransformer(), default: 0, type: 'numeric' })
  displayPrice: number;

  @Column({ nullable: true })
  imgUrl: string;

  @Column('jsonb', { nullable: true, default: [] })
  otherImgs: string[];

  @Column({ precision: 20, scale: 2, transformer: new ColumnNumericTransformer(), default: 0, type: 'numeric' })
  commingPrice: number;

  @Column({ precision: 20, scale: 2, transformer: new ColumnNumericTransformer(), default: 0, type: 'numeric' })
  collectionPrice: number;

  @Column({ nullable: true, default: 0 })
  priceMeter: number;

  @Column({ precision: 20, scale: 2, transformer: new ColumnNumericTransformer(), default: 0, type: 'numeric' })
  meterPrice: number;

  @Column({ nullable: true, default: false })
  isMetric: boolean;

  @Column({ nullable: true, default: false })
  isEdited: boolean;

  @ManyToOne(() => Shape, (shape) => shape.productsExcel)
  @JoinColumn()
  shape: Shape;

  @ManyToOne(() => Size, (size) => size.productsExcel)
  @JoinColumn()
  size: Size;

  @ManyToOne(() => Style, (style) => style.productsExcel)
  @JoinColumn()
  style: Style;

  @ManyToOne(() => Color, (color) => color.productsExcel)
  @JoinColumn()
  color: Color;

  @ManyToOne(() => Model, (model) => model.productsExcel)
  @JoinColumn()
  model: Model;

  @ManyToOne(() => Collection, (collection) => collection.productsExcel)
  @JoinColumn()
  collection: Collection;

  @ManyToOne(() => Partiya, (partiya) => partiya.productsExcel, { onDelete: 'CASCADE' })
  @JoinColumn()
  partiya: Partiya;

  public calculateProductPrice() {
    this.meterPrice = this.priceMeter;
  }
}
