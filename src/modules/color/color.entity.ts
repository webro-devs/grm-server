import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('color')
export class Color {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  title: string;
}
