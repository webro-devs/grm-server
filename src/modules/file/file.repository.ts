import { Repository } from 'typeorm';

import { File } from './file.entity';

export class FileRepository extends Repository<File> {}
