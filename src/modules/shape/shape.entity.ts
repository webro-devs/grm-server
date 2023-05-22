import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('shape')
export class Shape {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  title: string;
}
