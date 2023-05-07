import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('collection')
export class Collection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  title: string;
}
