import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('action')
export class Action {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  title: string;
}
