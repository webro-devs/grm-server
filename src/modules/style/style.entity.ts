import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('style')
export class Style {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  title: string;
}
