import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('shape')
export class Position {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  title: string;
}
