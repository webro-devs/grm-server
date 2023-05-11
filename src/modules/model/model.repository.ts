import { Repository } from 'typeorm';

import { Model } from './model.entity';

export class ModelRepository extends Repository<Model> {}
