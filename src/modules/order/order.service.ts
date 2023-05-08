import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderRepository } from './order.repository';
import { FindOptionsWhere } from 'typeorm';
import { UpdateOrderDto, CreateOrderDto } from './dto';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

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
    const response = await this.orderRepository.update({ id }, value);
    return response;
  }

  async create(value: CreateOrderDto) {
    const data = this.orderRepository.create(value);
    return await this.orderRepository.save(data);
  }
}
