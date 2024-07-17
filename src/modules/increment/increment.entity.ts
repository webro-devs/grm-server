import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('increment')
export class Increment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 0, type: 'int' })
  index: number;
}
