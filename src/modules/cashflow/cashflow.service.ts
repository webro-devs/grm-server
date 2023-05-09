import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { CreateCashflowDto, UpdateCashflowDto } from './dto';

import { Cashflow } from './cashflow.entity';
import { CashflowRepository } from './cashflow.repository';

Injectable();
export class CashflowService {
  constructor(
    @InjectRepository(Cashflow)
    private readonly cashflowRepository: CashflowRepository,
  ) {}

  async getAll(options: IPaginationOptions): Promise<Pagination<Cashflow>> {
    return paginate<Cashflow>(this.cashflowRepository, options, {
      // order: {
      //   title: 'ASC',
      // },
    });
  }

  async getOne(id: string) {
    const data = await this.cashflowRepository.findOne({
      where: { id },
    });

    if (!data) {
      throw new HttpException('data not found', HttpStatus.NOT_FOUND);
    }

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.cashflowRepository.delete(id);
    return response;
  }

  async change(value: UpdateCashflowDto, id: string) {
    const response = await this.cashflowRepository.update({ id }, value);
    return response;
  }

  async create(value: CreateCashflowDto) {
    const data = this.cashflowRepository.create(value);
    return await this.cashflowRepository.save(data);
  }
}
