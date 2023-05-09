import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { FindOptionsWhere } from 'typeorm';

import { Order } from './order.entity';
import { OrderRepository } from './order.repository';
import { UpdateOrderDto, CreateOrderDto } from './dto';

Injectable();
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: OrderRepository,
  ) {}

  async getAll(
    options: IPaginationOptions,
    where?: FindOptionsWhere<Order>,
  ): Promise<Pagination<Order>> {
    return paginate<Order>(this.orderRepository, options);
  }

  async getById(id: string) {
    const data = await this.orderRepository.findOne({ where: { id } });
    if (!data) {
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    }
    return data;
  }
  async getOne(id: string) {
    const data = await this.orderRepository.findOne({
      where: { id },
    });

    if (!data) {
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    }

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.orderRepository.delete(id);
    return response;
  }

  async change(value: UpdateOrderDto, id: string) {
    const response = await this.orderRepository
      .createQueryBuilder()
      .update()
      .set(value as unknown as Order)
      .where('id = :id', { id })
      .execute();
    return response;
  }

  async create(value: CreateOrderDto) {
    const data = this.orderRepository
      .createQueryBuilder()
      .insert()
      .into(Order)
      .values(value as unknown as Order)
      .returning('id')
      .execute();
    return data;
  }
}
