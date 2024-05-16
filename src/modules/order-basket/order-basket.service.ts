import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderBasket } from './order-basket.entity';
import { Repository, UpdateResult } from 'typeorm';
import { createOrderBasketDto, orderBasketUpdateDto } from './dto';
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

  async findAll(user: User) {
    return this.orderBasketRepository.find({
      where: {
        seller: { id: user.id },
      },
      relations: {
        product: { filial: true },
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

  async bulkDelete(id: string) {
    await this.orderBasketRepository.delete({ seller: { id } });
  }

  async update(id: string, value: orderBasketUpdateDto): Promise<UpdateResult> {
    const basket = await this.orderBasketRepository.findOne({ where: { id }, relations: { product: true } });
    if (basket.isMetric){
      if(basket.product.y < (value.x / 100)) throw new BadRequestException('Can not change upper than product length!');
    } else {
      if(basket.product.count < value.x) throw new BadRequestException('Can not change upper than product count!');
    }
    return await this.orderBasketRepository.update(id, value);
  }

  async calcDiscount(price: number, user: User): Promise<string> {
    const baskets = await this.orderBasketRepository.find({
      where: {
        seller: { id: user.id },
      },
      relations: { product: true },
    });
    const totalSum = baskets.reduce((acc, {
      product,
      isMetric,
      x,
    }) => isMetric ? (acc + (product.x * (x / 100) * product.price)) : acc + (x * product.price), 0);

    if (price > totalSum) return '0%';
    return (((totalSum - price) / totalSum) * 100).toFixed(2) + '%';
  }

  async calcProduct(user: User){
    const baskets = await this.orderBasketRepository.find({
      where: {
        seller: { id: user.id },
      },
      relations: { product: true },
    });
    return  baskets.reduce((acc, {
      product,
      isMetric,
      x,
    }) => isMetric ? (acc + (product.x * (x / 100) * product.price)) : acc + (x * product.price), 0);
  }
}