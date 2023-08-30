import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('country')
export class Country {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  title: string;
}
