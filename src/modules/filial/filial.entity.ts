import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('filial')
export class Filial {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
