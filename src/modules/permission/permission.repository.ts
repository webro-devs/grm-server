import { Repository } from 'typeorm';

import { Product } from './product.entity';

export class ProductRepository extends Repository<Product> {}
