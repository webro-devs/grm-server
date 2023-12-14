import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('style')
export class Style {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;
}
