import { Repository } from 'typeorm';

import { Shape } from './shape.entity';

export class ShapeRepository extends Repository<Shape> {}
