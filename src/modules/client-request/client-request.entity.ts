import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('client_request')
export class ClientRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @Column('varchar')
  location: string;

  @Column('varchar')
  phone: string;
}
