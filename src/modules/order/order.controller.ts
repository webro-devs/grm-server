import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';

@ApiTags('Order')
@Controller('order')
export class KassaController {
  constructor(private readonly orderService: OrderService) {}
}
