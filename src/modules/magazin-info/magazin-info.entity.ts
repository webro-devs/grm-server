import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('magazin_info')
export class MagazinInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  terms: string;

  @Column('varchar')
  availability: string;
}
