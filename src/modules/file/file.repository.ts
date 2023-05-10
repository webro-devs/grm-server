import { Repository } from 'typeorm';

import { FileEntity } from './file.entity';

export class FileRepository extends Repository<FileEntity> {}
