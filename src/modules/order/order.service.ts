import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { DataSource, EntityManager, FindOptionsWhere } from 'typeorm';

import { Order } from './order.entity';
import { OrderRepository } from './order.repository';
import { UpdateOrderDto, CreateOrderDto } from './dto';
import { ProductService } from '../product/product.service';
import { KassaService } from '../kassa/kassa.service';

Injectable();
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: OrderRepository,
    private readonly productService: ProductService,
    private readonly kassaService: KassaService,
    private readonly connection: DataSource,
  ) {}

  async getAll(
    options: IPaginationOptions,
    where?: FindOptionsWhere<Order>,
  ): Promise<Pagination<Order>> {
    return paginate<Order>(this.orderRepository, options);
  }

  async getById(id: string) {
    const data = await this.orderRepository.findOne({
      where: { id },
      relations: { casher: true, seller: true, product: true },
    });
    if (!data) {
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    }
    return data;
  }

  async deleteOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: { kassa: true },
    });
    const kassa = await this.kassaService.getById(order.kassa.id);
    kassa.totalSum = +kassa.totalSum - order.price;
    if (order.isPlasticPayment) {
      kassa.plasticSum = +kassa.plasticSum - order.price;
    }
    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(kassa);
    });
    const response = await this.orderRepository.delete(id);
    return response;
  }

  async change(value: UpdateOrderDto, id: string) {
    if (value.price) {
      const order = await this.orderRepository.findOne({
        where: { id },
        relations: { kassa: true },
      });
      if (order.isActive) {
        const kassa = await this.kassaService.getById(order.kassa.id);
        kassa.totalSum = +kassa.totalSum - order.price;
        kassa.totalSum = +kassa.totalSum + value.price;
        if (order.isPlasticPayment) {
          kassa.plasticSum = +kassa.plasticSum - order.price;
          kassa.plasticSum = +kassa.plasticSum + value.price;
        }
        await this.connection.transaction(async (manager: EntityManager) => {
          await manager.save(kassa);
        });
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
    await this.connection.transaction(async (manager) => {
      await manager.save(product);
    });
    const data = { ...value, seller: id };
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
      relations: { kassa: true },
    });
    const kassa = await this.kassaService.getById(order.kassa.id);
    kassa.totalSum += order.price;
    if (order.isPlasticPayment) {
      kassa.plasticSum = +kassa.plasticSum + order.price;
    }
    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(kassa);
    });
    const response = await this.orderRepository
      .createQueryBuilder()
      .update()
      .set({ isActive: true, casher } as unknown as Order)
      .where('id = :id', { id })
      .execute();
    return response;
  }
}
