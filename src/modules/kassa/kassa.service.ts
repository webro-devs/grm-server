import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual, Not, Repository } from 'typeorm';

import { Kassa } from './kassa.entity';
import { CreateKassaDto, UpdateKassaDto } from './dto';
import { FilialService } from '../filial/filial.service';
import { ActionService } from '../action/action.service';

Injectable();
export class KassaService {
  constructor(
    @InjectRepository(Kassa)
    private readonly kassaRepository: Repository<Kassa>,
    private readonly filialService: FilialService,
    private readonly actionService: ActionService,
  ) {}

  async getAll(options: IPaginationOptions, where?: FindOptionsWhere<Kassa>): Promise<Pagination<Kassa>> {
    return paginate<Kassa>(this.kassaRepository, options, {
      relations: { orders: true, cashflow: true },
    });
  }

  async getReport(options: IPaginationOptions, user, where) {
    console.log(user);

    let startDate = where.startDate,
      endDate = where.endDate;

    if (endDate) {
      where.endDate = LessThanOrEqual(endDate);
    }
    if (startDate) {
      where.startDate = MoreThanOrEqual(startDate);
    }
    console.log(where);

    return paginate<Kassa>(this.kassaRepository, options, {
      relations: {
        filial: {
          users: true,
        },
      },
      where: {
        ...(startDate && { startDate: MoreThanOrEqual(startDate) }),
        ...(endDate && { startDate: LessThanOrEqual(endDate) }),
        isActive: false,
        filial: { id: user.filial.id, users: { role: 2 } },
      },
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
      relations: {
        orders: {
          seller: true,
          product: {
            color: true,
            model: { collection: true },
          },
        },
        cashflow: {
          casher: true,
        },
        filial: true,
      },
      where: { filial: { id }, isActive: true },
    });

    if (kassa) {
      kassa['cashflowAndOrders'] = this.mergeAndSortCashflowsAndOrders(kassa);
    }

    return kassa;
  }

  async closeKassa(id: string, user) {
    const response = await this.kassaRepository.update(id, {
      isActive: false,
      endDate: new Date(),
    });
    const _kassa = await this.kassaRepository.findOne({ where: { id }, relations: { filial: true } });
    await this.actionService.create(_kassa, user.id, _kassa.filial.id, 'close_kassa', `$${_kassa.totalSum}`);
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
      where: {
        ...where,
        isActive: true,
      },
    });

    if (data.length) {
      const comingSum = data.map((d) => d.totalSum).reduce((a, b) => a + b);

      const netProfitTotalSum = data.map((d) => d.netProfitTotalSum).reduce((a, b) => a + b);

      const goingSumBoss = data.map((d) => d.expenditureBoss).reduce((a, b) => a + b);

      const goingSumShop = data.map((d) => d.expenditureShop).reduce((a, b) => a + b);

      const sellingSize = data.map((d) => d.totalSize).reduce((a, b) => a + b);

      const cashFlowSumBoss = data.map((d) => d.cashFlowSumBoss).reduce((a, b) => a + b);

      const cashFlowSumShop = data.map((d) => d.cashFlowSumShop).reduce((a, b) => a + b);

      const additionalProfitTotalSum = data.map((d) => d.additionalProfitTotalSum || 0).reduce((a, b) => a + b);

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
        netProfitTotalSum,
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
        netProfitTotalSum: 0,
      };
    }
  }

  async kassaTotal(where) {
    const data = await this.kassaRepository.find({
      where,
    });

    if (data.length) {
      const kassa = data.reduce(
        (
          prev,
          {
            totalSum,
            expenditureBoss,
            expenditureShop,
            totalSize,
            additionalProfitTotalSum,
            cashFlowSumBoss,
            cashFlowSumShop,
            plasticSum,
            netProfitTotalSum,
          },
        ) => {
          return {
            comingSum: totalSum || 0 + prev.comingSum,
            goingSumBoss: expenditureBoss || 0 + prev.goingSumBoss,
            goingSumShop: expenditureShop || 0 + prev.goingSumShop,
            sellingSize: totalSize || 0 + prev.sellingSize,
            additionalProfitTotalSum: additionalProfitTotalSum || 0 + prev.additionalProfitTotalSum,
            cashFlowSumBoss: cashFlowSumBoss || 0 + prev.cashFlowSumBoss,
            cashFlowSumShop: cashFlowSumShop || 0 + prev.cashFlowSumShop,
            plasticSum: plasticSum || 0 + prev.plasticSum,
            netProfitTotalSum: netProfitTotalSum || 0 + prev.netProfitTotalSum,
          };
        },
        {
          netProfitTotalSum: 0,
          comingSum: 0,
          goingSumBoss: 0,
          goingSumShop: 0,
          sellingSize: 0,
          additionalProfitTotalSum: 0,
          cashFlowSumBoss: 0,
          cashFlowSumShop: 0,
          plasticSum: 0,
        },
      );
      return kassa;
    } else {
      return {
        netProfitTotalSum: 0,
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
      ...cashflow,
      date: new Date(cashflow.date),
    }));

    const orders = kassa.orders.map((order) => ({
      ...order,
      collection: order.product.model.collection,
      date: new Date(order.date),
    }));

    const mergedArray = [...cashflows, ...orders];

    // Sort the merged array by date
    const sortedArray = mergedArray.sort((b, a) => a.date.getTime() - b.date.getTime());

    return sortedArray;
  }
}
