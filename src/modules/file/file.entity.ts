import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('file')
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
