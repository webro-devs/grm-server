import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('style')
export class Style {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { unique: true })
  title: string;
}
