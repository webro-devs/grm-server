import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('partiya')
export class Partiya {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
