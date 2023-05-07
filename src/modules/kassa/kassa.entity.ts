import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('kassa')
export class Kassa {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
