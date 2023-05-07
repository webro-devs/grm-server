import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('filial')
export class Filial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  address: string;

  @Column()
  startWorkTime: string;

  @Column()
  endWorkTime: string;
}
