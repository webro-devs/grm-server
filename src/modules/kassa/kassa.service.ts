import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { FindOptionsWhere } from 'typeorm';

import { Kassa } from './kassa.entity';
import { KassaRepository } from './kassa.repository';
import { CreateKassaDto, UpdateKassaDto } from './dto';
import { CashFlowEnum } from '../../infra/shared/enum';
import { FilialService } from '../filial/filial.service';

Injectable();
export class KassaService {
  constructor(
    @InjectRepository(Kassa)
    private readonly kassaRepository: KassaRepository,
    private readonly filialService: FilialService,
  ) {}

  async getAll(
    options: IPaginationOptions,
    where?: FindOptionsWhere<Kassa>,
  ): Promise<Pagination<Kassa>> {
    return paginate<Kassa>(this.kassaRepository, options);
  }

  async getById(id: string) {
    const data = await this.kassaRepository.findOne({ where: { id } });
    if (!data) {
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    }
    return data;
  }
  async getOne(id: string) {
    const data = await this.kassaRepository.findOne({
      where: { id },
    });

    if (!data) {
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    }

    return data;
  }

  async GetOpenKassa(id: string) {
    const data = await this.kassaRepository.findOne({
      where: { isActive: true, filial: { id } },
    });

    if (!data) {
      return {};
    }

    return data;
  }

  async closeKassa(id: string) {
    const response = await this.kassaRepository.update(id, { isActive: false });
    return response;
  }

  async deleteOne(id: string) {
    const response = await this.kassaRepository.delete(id);
    return response;
  }

  async change(value: UpdateKassaDto, id: string) {
    const response = await this.kassaRepository
      .createQueryBuilder()
      .update()
      .set(value as unknown as Kassa)
      .where('id = :id', { id })
      .execute();
    return response;
  }

  async create(value: CreateKassaDto) {
    const data = this.kassaRepository
      .createQueryBuilder()
      .insert()
      .into(Kassa)
      .values(value as unknown as Kassa)
      .returning('id')
      .execute();
    return data;
  }

  async getKassaSum(id: string) {
    const data = await this.kassaRepository.findOne({
      where: { id },
      relations: { orders: true, cashflow: true },
    });
    const result = await this.calculateKassa([data]);
    return result;
  }

  async kassaSumByFilialAndRange(where) {
    const data = await this.kassaRepository.find({
      where,
      relations: { orders: true, cashflow: true },
    });
    if (data.length) {
      const { comingSum, goingSum } = await this.calculateKassa(data);
      return { comingSum, goingSum };
    } else {
      return { comingSum: 0, goingSum: 0 };
    }
  }

  async kassaSumAllFilialByRange(where) {
    const result = [];
    const filialData = await this.filialService.getAllFilial();
    for (let filial of filialData) {
      where.filial = filial.id;
      const { comingSum, goingSum } = await this.kassaSumByFilialAndRange(
        where,
      );
      result.push({ ...filial, comingSum, goingSum });
    }
    return result;
  }

  async calculateKassa(data: Kassa[]) {
    let comingSum = 0,
      goingSum = 0;
    for (let item of data) {
      const orderSum = item.orders
        .filter((o) => o.isActive)
        .map((or) => or.price)
        .reduce((a, b) => a + b);
      const cashFlowSum = item.cashflow
        .filter((c) => c.type == CashFlowEnum.InCome)
        .map((c) => c.price)
        .reduce((a, b) => a + b);
      comingSum += orderSum + cashFlowSum;
      goingSum += item.cashflow
        .filter((c) => c.type == CashFlowEnum.Consumption)
        .map((c) => c.price)
        .reduce((a, b) => a + b);
    }
    return { comingSum, goingSum };
  }
}
