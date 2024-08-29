import { BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('userTimeLog')
export class UserTimeLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.timeLogs)
  @JoinColumn()
  user: User;

  @Column()
  enter: Date;

  @Column()
  leave: Date;

  @Column('int')
  totalTime: number;

  @BeforeUpdate()
  async calcTotalTime() {
    if (this.leave) {
      const enterTime = new Date(this.enter).getTime();
      const leaveTime = new Date(this.leave).getTime();
      const timeDifference = leaveTime - enterTime;

      this.totalTime = timeDifference / (1000 * 60 * 60);
    }
  }
}
