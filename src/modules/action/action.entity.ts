import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Filial } from '../filial/filial.entity';
import { User } from '../user/user.entity';

@Entity('action')
export class Action {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.actions)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Filial, (filial) => filial.actions)
  filial: Filial;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: string;

  @Column('varchar')
  type: string;

  @Column('varchar')
  desc: string;

  @Column('jsonb')
  info;
}
