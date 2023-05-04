import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from './position.service';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly adminService: ProductService) {}
}
