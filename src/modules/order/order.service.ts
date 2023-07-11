import {
  HttpException,
  HttpStatus,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import {
  DataSource,
  EntityManager,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { Order } from './order.entity';
import { UpdateOrderDto, CreateOrderDto } from './dto';
import { UpdateProductDto } from '../product/dto';
import { ProductService } from '../product/product.service';
import { KassaService } from '../kassa/kassa.service';
import { ActionService } from '../action/action.service';

Injectable();
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly productService: ProductService,
    private readonly kassaService: KassaService,
    private readonly actionService: ActionService,
    private readonly connection: DataSource,
  ) {}

  async getAll(
    options: IPaginationOptions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    where?: FindOptionsWhere<Order>,
  ): Promise<Pagination<Order>> {
    return paginate<Order>(this.orderRepository, options);
  }

  async getById(id: string) {
    const data = await this.orderRepository
      .findOne({
        where: { id },
        relations: { casher: true, seller: true, product: true },
      })
      .catch(() => {
        throw new NotFoundException('data not found');
      });
    return data;
  }

  async deleteOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: { kassa: true, product: true },
    });
    if (order.isActive) {
      const kassa = await this.kassaService.getById(order.kassa.id);
      kassa.totalSum = +kassa.totalSum - order.price;
      kassa.totalSize =
        +kassa.totalSize - order.count * (+order.product.x * +order.product.y);
      if (order.isPlasticPayment) {
        kassa.plasticSum = +kassa.plasticSum - order.price;
      }
      await this.saveRepo(kassa);
    }

    const product = order.product;
    product.count += order.count;
    product.setTotalSize();
    await this.saveRepo(product);

    const response = await this.orderRepository.delete(id).catch(() => {
      throw new NotFoundException('data not found');
    });
    return response;
  }

  async change(value: UpdateOrderDto, id: string) {
    if (value.price || value.count) {
      const order = await this.orderRepository.findOne({
        where: { id },
        relations: { kassa: true, product: true },
      });
      const kassa = await this.kassaService.getById(order.kassa.id);

      if (value.count) {
        const product = order.product;
        const diff = order.count - value.count;
        product.count += diff;
        await this.saveRepo(product);

        if (order.isActive) {
          kassa.totalSize =
            +kassa.totalSize -
            order.count * (+order.product.x * +order.product.y);
          kassa.totalSize =
            +kassa.totalSize +
            value.count * (+order.product.x * +order.product.y);

          await this.saveRepo(kassa);
        }
      }
      if (order.isActive && value.price) {
        kassa.totalSum = +kassa.totalSum - order.price;
        kassa.totalSum = +kassa.totalSum + value.price;
        if (order.isPlasticPayment) {
          kassa.plasticSum = +kassa.plasticSum - order.price;
          kassa.plasticSum = +kassa.plasticSum + value.price;
        }
        await this.saveRepo(kassa);
      }
    }
    const response = await this.orderRepository
      .createQueryBuilder()
      .update()
      .set(value as unknown as Order)
      .where('id = :id', { id })
      .execute();
    return response;
  }

  async create(value: CreateOrderDto, id: string) {
    const product = await this.productService.getOne(value.product);
    if (product.count < value.count) {
      throw new HttpException('Not enough product', HttpStatus.BAD_REQUEST);
    }
    product.count = +product.count - value.count;
    product.setTotalSize();
    await this.saveRepo(product);

    const additionalProfitSum = value.price - +product.price * value.count;
    const netProfitSum = value.count * (product.price - product.comingPrice);

    const data = { ...value, seller: id, additionalProfitSum, netProfitSum };
    const response = this.orderRepository
      .createQueryBuilder()
      .insert()
      .into(Order)
      .values(data as unknown as Order)
      .returning('id')
      .execute();
    return response;
  }

  async checkOrder(id: string, casher: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: { kassa: true, product: true },
    });

    const kassa = await this.kassaService.getById(order.kassa.id);

    kassa.totalSum = +kassa.totalSum + +order.price;

    kassa.totalSize =
      +kassa.totalSize + order.count * (+order.product.x * +order.product.y);

    kassa.netProfitTotalSum = +kassa.netProfitTotalSum + +order.netProfitSum;

    kassa.additionalProfitTotalSum =
      +kassa.additionalProfitTotalSum + +order.additionalProfitSum;

    if (order.isPlasticPayment) {
      kassa.plasticSum = +kassa.plasticSum + +order.price;
    }

    await this.saveRepo(kassa);

    const response = await this.orderRepository
      .createQueryBuilder()
      .update()
      .set({ isActive: true, casher } as unknown as Order)
      .where('id = :id', { id })
      .execute();

    return response;
  }

  async saveRepo(data: any) {
    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(data);
    });
  }

  async rejectOrder(id: string) {
    const data = await this.orderRepository.findOne({
      where: { id },
      relations: { product: true },
    });

    const response = await this.productService.change(
      { count: data.product.count + data.count } as UpdateProductDto,
      data.product.id,
    );

    return response;
  }
}
