import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { CreateCashflowDto, UpdateCashflowDto } from './dto';

import { Cashflow } from './cashflow.entity';
import { KassaService } from '../kassa/kassa.service';
import { CashFlowEnum, CashflowExpenditureEnum } from '../../infra/shared/enum';
import { DataSource, EntityManager, Repository } from 'typeorm';

Injectable();
export class CashflowService {
  constructor(
    @InjectRepository(Cashflow)
    private readonly cashflowRepository: Repository<Cashflow>,
    private readonly kassaService: KassaService,
    private readonly connection: DataSource,
  ) {}

  async getAll(options: IPaginationOptions): Promise<Pagination<Cashflow>> {
    return paginate<Cashflow>(this.cashflowRepository, options);
  }

  async getOne(id: string) {
    const data = await this.cashflowRepository
      .findOne({
        where: { id },
      })
      .catch(() => {
        throw new NotFoundException('data not found');
      });

    return data;
  }

  async deleteOne(id: string) {
    const cashflow = await this.cashflowRepository.findOne({
      where: { id },
      relations: { kassa: true },
    });
    const kassa = await this.kassaService.getById(cashflow.kassa.id);
    if (cashflow.type == CashFlowEnum.InCome) {
      kassa.totalSum = +kassa.totalSum - cashflow.price;
      kassa.cashFlowSum = +kassa.cashFlowSum - cashflow.price;
    }
    if (cashflow.type == CashFlowEnum.Consumption) {
      if (cashflow.title == CashflowExpenditureEnum.BOSS) {
        kassa.expenditureBoss = +kassa.expenditureBoss - cashflow.price;
      } else {
        kassa.expenditureShop = +kassa.expenditureShop - cashflow.price;
      }
    }

    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(kassa);
    });

    const response = await this.cashflowRepository.delete(id).catch(() => {
      throw new NotFoundException('data not found');
    });
    return response;
  }

  async change(value: UpdateCashflowDto, id: string) {
    if (value.price) {
      const cashflow = await this.cashflowRepository.findOne({ where: { id } });
      const kassa = await this.kassaService.getById(value.kassa);
      if (value.type == CashFlowEnum.InCome) {
        if (cashflow.type == CashFlowEnum.InCome) {
          kassa.totalSum = +kassa.totalSum - cashflow.price;
          kassa.totalSum = +kassa.totalSum + value.price;
          kassa.cashFlowSum = +kassa.cashFlowSum - cashflow.price;
          kassa.cashFlowSum = +kassa.cashFlowSum + value.price;
        } else {
          if (cashflow.title == CashflowExpenditureEnum.BOSS) {
            kassa.expenditureBoss = +kassa.expenditureBoss - cashflow.price;
          } else {
            kassa.expenditureShop = +kassa.expenditureShop - cashflow.price;
          }
          kassa.totalSum = +kassa.totalSum + value.price;
          kassa.cashFlowSum = +kassa.cashFlowSum + value.price;
        }
      }
      if (value.type == CashFlowEnum.Consumption) {
        if (cashflow.type == CashFlowEnum.Consumption) {
          if (cashflow.title == CashflowExpenditureEnum.BOSS) {
            if (value.title == CashflowExpenditureEnum.BOSS) {
              kassa.expenditureBoss = +kassa.expenditureBoss - cashflow.price;
              kassa.expenditureBoss = +kassa.expenditureBoss + value.price;
            } else {
              kassa.expenditureBoss = +kassa.expenditureBoss - cashflow.price;
              kassa.expenditureShop = +kassa.expenditureShop + value.price;
            }
          } else {
            if (value.title == CashflowExpenditureEnum.BOSS) {
              kassa.expenditureShop = +kassa.expenditureShop - cashflow.price;
              kassa.expenditureBoss = +kassa.expenditureBoss + value.price;
            } else {
              kassa.expenditureShop = +kassa.expenditureShop - cashflow.price;
              kassa.expenditureShop = +kassa.expenditureShop + value.price;
            }
          }
        } else {
          kassa.totalSum = +kassa.totalSum - cashflow.price;
          kassa.cashFlowSum = +kassa.cashFlowSum - cashflow.price;
          if (value.title == CashflowExpenditureEnum.BOSS) {
            kassa.expenditureBoss = +kassa.expenditureBoss + value.price;
          } else {
            kassa.expenditureShop = +kassa.expenditureShop + value.price;
          }
        }
      }
      await this.connection.transaction(async (manager: EntityManager) => {
        await manager.save(kassa);
      });
    }
    const response = await this.cashflowRepository
      .createQueryBuilder()
      .update()
      .set(value as unknown as Cashflow)
      .where('id = :id', { id })
      .execute();
    return response;
  }

  async create(value: CreateCashflowDto, id: string) {
    const data = { ...value, casher: id };
    const response = this.cashflowRepository
      .createQueryBuilder()
      .insert()
      .into(Cashflow)
      .values(data as unknown as Cashflow)
      .returning('id')
      .execute();

    const kassa = await this.kassaService.getById(value.kassa);
    if (value.type == CashFlowEnum.InCome) {
      kassa.totalSum = +kassa.totalSum + value.price;
      kassa.cashFlowSum = +kassa.cashFlowSum + value.price;
    }
    if (value.type == CashFlowEnum.Consumption) {
      if (value.title == CashflowExpenditureEnum.BOSS) {
        kassa.expenditureBoss = +kassa.expenditureBoss + value.price;
      } else {
        kassa.expenditureShop = +kassa.expenditureShop + value.price;
      }
    }
    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(kassa);
    });

    return response;
  }
}
