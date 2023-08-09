import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Partiya } from '../partiya/partiya.entity';

@Entity('excel')
export class Excel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  path: string;

  @OneToOne(() => Partiya, (partiya) => partiya.excel, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn()
  partiya: Partiya;
}
