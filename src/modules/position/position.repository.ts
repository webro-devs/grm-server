import { Repository } from 'typeorm';

import { Product } from './position.entity';

export class ProductRepository extends Repository<Product> {}
