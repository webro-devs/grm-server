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
import { CashFlowEnum } from '../../infra/shared/enum';
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
    }
    if (cashflow.type == CashFlowEnum.Consumption) {
      kassa.expenditure = +kassa.expenditure - cashflow.price;
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
        } else {
          kassa.expenditure = +kassa.expenditure - cashflow.price;
          kassa.totalSum = +kassa.totalSum + value.price;
        }
      }
      if (value.type == CashFlowEnum.Consumption) {
        if (cashflow.type == CashFlowEnum.Consumption) {
          kassa.expenditure = +kassa.expenditure - cashflow.price;
          kassa.expenditure = +kassa.expenditure + value.price;
        } else {
          kassa.totalSum = +kassa.totalSum - cashflow.price;
          kassa.expenditure = +kassa.expenditure + value.price;
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
    }
    if (value.type == CashFlowEnum.Consumption) {
      kassa.expenditure = +kassa.expenditure + value.price;
    }
    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(kassa);
    });

    return response;
  }
}
