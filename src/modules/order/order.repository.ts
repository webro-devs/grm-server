import { Repository } from 'typeorm';

import { Order } from './order.entity';

export class OrderRepository extends Repository<Order> {}
