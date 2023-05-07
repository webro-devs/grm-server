import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('partiya')
export class Partiya {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
