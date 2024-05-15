import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderBasket } from './order-basket.entity';
import { Repository } from 'typeorm';
import { createOrderBasketDto } from './dto';
import { User } from '../user/user.entity';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class OrderBasketService {
  constructor(
    @InjectRepository(OrderBasket)
    private readonly orderBasketRepository: Repository<OrderBasket>,
  ) {
  }

  async find(user: User, options: IPaginationOptions): Promise<Pagination<OrderBasket>> {
    return paginate<OrderBasket>(this.orderBasketRepository, options, {
      where: {
        seller: {
          id: user.id,
        },
      },
      relations: {
        product: { model: { collection: true }, color: true },
      },
    });
  }

  async create(value: createOrderBasketDto, user: User) {
    const [product] = await this.orderBasketRepository.query(`select * from product where id = '${value.product}'`);
    if(user.role < 4){
      if(user.filial.id !== product.filialId){
       throw new BadRequestException('It is not your product!');
      }
    }
    if (value.isMetric) {
      if (product.y < value.x / 100) throw new BadRequestException('Not enough product meter!');
    } else {
      if (product.count < value.x) throw new BadRequestException('Not enough product count!');
    }
    value.seller = user.id;
    const data = this.orderBasketRepository.create(value as unknown as OrderBasket);
    await this.orderBasketRepository.save(data);
    return await this.orderBasketRepository.findOne({
      where: { id: data.id },
      relations: { product: { model: { collection: true }, color: true } },
    });
  }

  async delete(id: string) {
    return await this.orderBasketRepository.delete(id);
  }

  async bulkDelete(id) {
    await this.orderBasketRepository.delete({ seller: { id } });
  }
}