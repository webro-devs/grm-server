import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('kassa')
export class Kassa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  startDate: string;

  @Column({ type: 'varchar' })
  endDate: string;

  @Column({ type: 'varchar' })
  filial: string;

  @Column({ type: 'varchar' })
  order: string;

  @Column({ type: 'varchar' })
  money: string;
}
