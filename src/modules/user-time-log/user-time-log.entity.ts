import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { ColumnNumericTransformer } from 'src/infra/helpers';

@Entity('userTimeLog')
export class UserTimeLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.timeLogs)
  @JoinColumn()
  user: User;

  @Column()
  enter: Date;

  @Column({nullable: true})
  leave: Date;

  @Column('numeric', {
    precision: 20,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
    default: 0,
  })
  totalTime: number;
}
