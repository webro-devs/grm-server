import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('clientRequest')
export class ClientRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @Column('varchar')
  location: string;

  @Column('varchar')
  number: string;
}
