import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('transfer')
export class Transfer {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('varchar')
  title: string;
}
