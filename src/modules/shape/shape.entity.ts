import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('shape')
export class Shape {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {unique: true})
  title: string;
}
