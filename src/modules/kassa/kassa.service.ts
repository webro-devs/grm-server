import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { FindOptionsWhere, Repository } from 'typeorm';

import { Kassa } from './kassa.entity';
import { CreateKassaDto, UpdateKassaDto } from './dto';
import { CashFlowEnum } from '../../infra/shared/enum';
import { FilialService } from '../filial/filial.service';

Injectable();
export class KassaService {
  constructor(
    @InjectRepository(Kassa)
    private readonly kassaRepository: Repository<Kassa>,
    private readonly filialService: FilialService,
  ) {}

  async getAll(options: IPaginationOptions, where?: FindOptionsWhere<Kassa>): Promise<Pagination<Kassa>> {
    return paginate<Kassa>(this.kassaRepository, options, {
      relations: { orders: true, cashflow: true },
    });
  }

  async getById(id: string) {
    const data = await this.kassaRepository.findOne({ where: { id } }).catch(() => {
      throw new NotFoundException('data not found');
    });
    return data;
  }
  async getOne(id: string) {
    const data = await this.kassaRepository
      .findOne({
        where: { id },
        relations: {
          filial: true,
        },
      })
      .catch(() => {
        throw new NotFoundException('data not found');
      });

    return data;
  }

  async GetOpenKassa(id: string) {
    const kassa = await this.kassaRepository.findOne({
      where: { filial: { id }, isActive: true },
      relations: {
        orders: {
          seller: true,
        },
        cashflow: {
          casher: true,
        },
        filial: true,
      },
    });

    if (kassa) {
      kassa['cashflowAndOrders'] = this.mergeAndSortCashflowsAndOrders(kassa);
    }

    return kassa;
  }

  async closeKassa(id: string) {
    const response = await this.kassaRepository.update(id, {
      isActive: false,
      endDate: new Date(),
    });
    return response;
  }

  async deleteOne(id: string) {
    const response = await this.kassaRepository.delete(id).catch(() => {
      throw new NotFoundException('data not found');
    });
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
    const check = await this.GetOpenKassa(value.filial);
    if (check) {
      return false;
    }

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
    });
    const comingSum = data.totalSum;
    const goingSum = data.expenditureBoss + data.expenditureShop;
    const sellingSize = data.totalSize;
    return { comingSum, goingSum, sellingSize };
  }

  async kassaSumByFilialAndRange(where) {
    const data = await this.kassaRepository.find({
      where,
    });

    if (data.length) {
      const comingSum = data.map((d) => d.totalSum).reduce((a, b) => a + b);

      const goingSumBoss = data.map((d) => d.expenditureBoss).reduce((a, b) => a + b);

      const goingSumShop = data.map((d) => d.expenditureShop).reduce((a, b) => a + b);

      const sellingSize = data.map((d) => d.totalSize).reduce((a, b) => a + b);

      const cashFlowSumBoss = data.map((d) => d.cashFlowSumBoss).reduce((a, b) => a + b);

      const cashFlowSumShop = data.map((d) => d.cashFlowSumShop).reduce((a, b) => a + b);

      const additionalProfitTotalSum = data.map((d) => d.additionalProfitTotalSum).reduce((a, b) => a + b);

      const plasticSum = data.map((d) => d.plasticSum).reduce((a, b) => a + b);

      return {
        comingSum,
        goingSumBoss,
        goingSumShop,
        sellingSize,
        additionalProfitTotalSum,
        cashFlowSumBoss,
        cashFlowSumShop,
        plasticSum,
      };
    } else {
      return {
        comingSum: 0,
        goingSumBoss: 0,
        goingSumShop: 0,
        sellingSize: 0,
        additionalProfitTotalSum: 0,
        cashFlowSumBoss: 0,
        cashFlowSumShop: 0,
        plasticSum: 0,
      };
    }
  }

  async kassaSumAllFilialByRange(where) {
    const result = [];
    const filialData = await this.filialService.getAllFilial();
    for (const filial of filialData) {
      where.filial = {
        id: filial.id,
      };
      const { comingSum, goingSumShop, goingSumBoss, sellingSize, plasticSum } = await this.kassaSumByFilialAndRange(where);
      result.push({
        ...filial,
        comingSum,
        goingSumShop,
        goingSumBoss,
        sellingSize,
        plasticSum,
      });
    }
    return result;
  }

  private mergeAndSortCashflowsAndOrders(kassa: Kassa): any[] {
    const cashflows = kassa.cashflow.map((cashflow) => ({
      type: 'cashflow',
      ...cashflow,
      date: new Date(cashflow.date),
    }));

    const orders = kassa.orders.map((order) => ({
      type: 'order',
      ...order,
      date: new Date(order.date),
    }));

    const mergedArray = [...cashflows, ...orders];

    // Sort the merged array by date
    const sortedArray = mergedArray.sort((b, a) => a.date.getTime() - b.date.getTime());

    return sortedArray;
  }
}
